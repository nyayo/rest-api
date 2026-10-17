import sanitize from 'mongo-sanitize';
import User from '../models/user.model.js';
import convertImage from '../utils/image.util.js';
import { userDTO, usersByPageLimitAndSearchQueryDTO, usersDTO } from '../dto/user.dto.js';
import { generateVCard } from '../utils/vcard.util.js';
import { isValidCategory } from '../utils/category.util.js';
import * as authService from './auth.service.js';

const USER_UPDATE_FIELDS = ['name', 'email', 'role', 'themeId', 'category'];

export const updateUser = async (id, options) => {
  if (!options || typeof options !== 'object') {
    throw new Error('Invalid options provided.');
  }

  const sanitizedOptions = sanitize(options);
  const update = {};

  USER_UPDATE_FIELDS.forEach((field) => {
    if (sanitizedOptions[field] !== undefined && sanitizedOptions[field] !== '') {
      update[field] = sanitizedOptions[field];
    }
  });

  if (Object.keys(update).length === 0) {
    throw new Error('No valid fields provided.');
  }

  const user = await User.findOneAndUpdate(
    { userId: { $eq: id } },
    update,
    { new: true },
  )
    .exec();

  if (!user) {
    throw new Error('User not found.');
  }

  return userDTO(user);
};

export const addClickStatistics = async (id, source) => {
  await User.updateOne(
    { userId: { $eq: id } },
    { $push: { clicks: { source } } },
  );
};

export const getClickStatistics = async (id) => {
  const user = await User.findOne({ userId: { $eq: id } })
    .exec();

  if (!user) {
    throw new Error('User not found.');
  }

  const today = new Date();
  const clickCountsByDate = {};
  const totalClicksByType = {
    qr: 0,
    nfc: 0,
    web: 0,
  };

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() - i);
    const dateString = currentDate.toISOString()
      .split('T')[0];

    clickCountsByDate[dateString] = {
      qr: 0,
      nfc: 0,
      web: 0,
    };
  }

  user.clicks.forEach((click) => {
    const {
      source,
      timestamp,
    } = click;
    const clickDate = new Date(timestamp);
    clickDate.setUTCHours(0, 0, 0, 0);
    const dateString = clickDate.toISOString()
      .split('T')[0];

    if (dateString in clickCountsByDate) {
      clickCountsByDate[dateString][source]++;
    }

    totalClicksByType[source]++;
  });

  const totalClicks = user.clicks.length;

  return {
    clickCountsByDate,
    totalClicks,
    totalClicksByType,
  };
};

export const getUsersByPageLimitAndSearchQuery = async (page, limit, searchQuery) => {
  const skipDocs = (page - 1) * limit;
  const escapedSearchQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const searchPattern = new RegExp(escapedSearchQuery, 'i');
  const query = User.find()
    .select('email name role userId themeId category')
    .skip(skipDocs)
    .limit(limit);
  const searchQueries = [
    { email: searchPattern },
    { name: searchPattern },
    { role: searchPattern },
  ];
  if (searchQuery) {
    query.or(searchQueries);
  }
  const users = await query;
  const totalUsers = await User.countDocuments({
    $or: searchQueries,
  });

  const totalPages = Math.ceil(totalUsers / limit);
  const nextPage = page < totalPages ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;

  return usersByPageLimitAndSearchQueryDTO(
    users,
    totalUsers,
    totalPages,
    nextPage,
    prevPage,
  );
};

export const updateUserSetting = async (id, theme) => {
  const sanitizedTheme = sanitize(theme);

  const updateField = { 'settings.theme': sanitizedTheme };

  const user = await User.findOneAndUpdate({ userId: { $eq: id } }, updateField)
    .exec();

  if (!user) {
    throw new Error('User not found.');
  }

  return user;
};

export const updateUserVCard = async (userId, vCardData) => {
  const sanitizedVCardData = sanitize(vCardData);

  const updateField = {
    'vCard.contact': sanitizedVCardData.contact,
    'vCard.location': sanitizedVCardData.location,
    'vCard.person': sanitizedVCardData.person,
    'vCard.professional': sanitizedVCardData.professional,
    'vCard.socialMedia': sanitizedVCardData.socialMedia,
  };

  if (sanitizedVCardData.category) {
    updateField.category = sanitizedVCardData.category;
  }

  const user = await User.findOneAndUpdate({ userId }, updateField, { new: true })
    .exec();

  if (!user) {
    throw new Error('User not found.');
  }

  return user;
};

export const getVCard = async (userId) => {
  const user = await User.findOne({ userId })
    .exec();

  if (!user) {
    throw new Error('User not found.');
  }

  return {
    ...user.vCard.toObject(),
    userId,
    category: user.category || 'other',
  };
};

export const getVcf = async (userId, version) => {
  const user = await User.findOne({ userId })
    .exec();

  if (!user) {
    throw new Error('User not found.');
  }

  const vCard = user.vCard.toObject();
  const filename = `${vCard.person.firstName}_${vCard.person.lastName}.vcf`;

  // Generate the VCF content based on the vCard and version
  const vcfContent = generateVCard(userId, vCard, version);

  return {
    filename,
    content: vcfContent,
  };
};

export const deleteUser = async (id) => {
  const user = await User.findOneAndDelete({ userId: { $eq: id } })
    .exec();

  if (!user) {
    throw new Error('User not found.');
  }
};

export const uploadImage = async (id, image, imageHeight, imageName = 'avatar') => {
  try {
    const {
      size,
      format,
    } = await convertImage(image, +imageHeight);

    const imageTarget = imageName === 'cover' ? 'cover' : 'avatar';

    const imageUpdate = {
      [`vCard.${imageTarget}.size`]: size,
      [`vCard.${imageTarget}.format`]: format,
    };

    await User.findOneAndUpdate({ userId: id }, imageUpdate)
      .exec();
  } catch (err) {
    throw new Error('Error uploading image.');
  }
};

export const getUsersByThemeId = async (themeId) => {
  const users = await User.find({ themeId })
    .exec();

  return usersDTO(users);
};

const BULK_BATCH_SIZE = 50;
const ALLOWED_ROLES = ['user', 'editor', 'admin'];
const EMAIL_PATTERN = /.+@.+\..+/;

const parseBooleanFlag = (value, fallback = false) => {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  const normalized = String(value).trim().toLowerCase();
  if (['true', '1', 'yes', 'on'].includes(normalized)) {
    return true;
  }

  if (['false', '0', 'no', 'off'].includes(normalized)) {
    return false;
  }

  return null;
};

export const validateBulkUserRow = (raw = {}, rowNumber) => {
  const name = String(raw.name || '').trim();
  const email = String(raw.email || '').trim().toLowerCase();
  const role = String(raw.role || 'user').trim().toLowerCase() || 'user';
  const category = String(raw.category || 'other').trim().toLowerCase() || 'other';
  const themeId = String(raw.themeId || raw.themeid || '').trim();
  const sendMail = parseBooleanFlag(raw.sendMail ?? raw.sendmail, false);

  if (!name) {
    return {
      row: rowNumber,
      email,
      status: 'error',
      message: 'Name is required.',
    };
  }

  if (name.length < 4 || name.length > 255) {
    return {
      row: rowNumber,
      email,
      status: 'error',
      message: 'Name must be between 4 and 255 characters.',
    };
  }

  if (!email) {
    return {
      row: rowNumber,
      email,
      status: 'error',
      message: 'Email is required.',
    };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return {
      row: rowNumber,
      email,
      status: 'error',
      message: 'Email is invalid.',
    };
  }

  if (!ALLOWED_ROLES.includes(role)) {
    return {
      row: rowNumber,
      email,
      status: 'error',
      message: 'Role must be user, editor, or admin.',
    };
  }

  if (!isValidCategory(category)) {
    return {
      row: rowNumber,
      email,
      status: 'error',
      message: 'Category is invalid.',
    };
  }

  if (sendMail === null) {
    return {
      row: rowNumber,
      email,
      status: 'error',
      message: 'sendMail must be true or false.',
    };
  }

  return {
    row: rowNumber,
    email,
    status: 'ok',
    message: '',
    payload: {
      name,
      email,
      role,
      category,
      themeId,
      sendMail,
    },
  };
};

export const bulkCreateUsers = async (rawRows) => {
  const seenEmails = new Set();
  const prepared = rawRows.map((raw, index) => {
    const validated = validateBulkUserRow(raw, index + 2);

    if (validated.status === 'error') {
      return validated;
    }

    if (seenEmails.has(validated.email)) {
      return {
        row: validated.row,
        email: validated.email,
        status: 'error',
        message: 'Duplicate email in CSV.',
      };
    }

    seenEmails.add(validated.email);
    return validated;
  });

  const results = [...prepared];
  const pendingIndexes = prepared
    .map((item, index) => (item.status === 'ok' ? index : -1))
    .filter((index) => index >= 0);

  for (let i = 0; i < pendingIndexes.length; i += BULK_BATCH_SIZE) {
    const batchIndexes = pendingIndexes.slice(i, i + BULK_BATCH_SIZE);
    // Sequential batches of 50 keep Mongo write load bounded.
    // eslint-disable-next-line no-await-in-loop
    const settled = await Promise.allSettled(
      batchIndexes.map((index) => authService.createUser(prepared[index].payload)),
    );

    settled.forEach((outcome, batchIndex) => {
      const resultIndex = batchIndexes[batchIndex];
      const current = results[resultIndex];

      if (outcome.status === 'fulfilled') {
        results[resultIndex] = {
          row: current.row,
          email: current.email,
          status: 'ok',
          message: 'Created.',
        };
        return;
      }

      results[resultIndex] = {
        row: current.row,
        email: current.email,
        status: 'error',
        message: outcome.reason?.message || 'Unable to create user.',
      };
    });
  }

  const created = results.filter((item) => item.status === 'ok').length;
  const failed = results.length - created;

  return {
    created,
    failed,
    results: results.map((item) => ({
      row: item.row,
      email: item.email,
      status: item.status,
      message: item.message,
    })),
  };
};
