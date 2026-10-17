import sanitizeHtml from 'sanitize-html';
import * as userService from '../services/user.service.js';
import { paginationOptions } from '../configs/pagination.config.js';
import { sanitizeOptions } from '../configs/sanitize.config.js';
import { BUSINESS_CATEGORIES, getCategoryDefaults } from '../utils/category.util.js';

export const getCategories = (_req, res) => res.json({ data: BUSINESS_CATEGORIES });

export const getCategoryDefaultsById = (req, res) => res.json({
  data: getCategoryDefaults(req.params.id),
});

export const updateUser = async (req, res) => {
  try {
    const options = req.body;
    const { id } = req.params;

    const newUser = await userService.updateUser(id, options);

    return res.json({ data: newUser });
  } catch (err) {
    return res.status(500)
      .json({ errors: [err.message] });
  }
};

export const addClickStatistics = async (req, res) => {
  try {
    let { source } = req.body;

    if (!['nfc', 'qr'].includes(source)) {
      source = 'web';
    }

    await userService.addClickStatistics(req.params.id, source);

    res.json({});
  } catch (err) {
    res.status(500)
      .json({ errors: [err.message] });
  }
};

export const getClickStatistics = async (req, res) => {
  try {
    const clickStats = await userService.getClickStatistics(req.params.id);
    return res.json({ data: clickStats });
  } catch (err) {
    return res.status(500)
      .json({ errors: [err.message] });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const page = +req.query.page || paginationOptions.page;
    const limit = +req.query.limit || paginationOptions.limit;
    const searchQuery = req.query.search || '';

    const usersData = await userService.getUsersByPageLimitAndSearchQuery(page, limit, searchQuery);

    res.json({
      data: usersData.users,
      pagination: {
        page,
        limit: usersData.limit,
        totalUsers: usersData.totalUsers,
        totalPages: usersData.totalPages,
        nextPage: usersData.nextPage,
        prevPage: usersData.prevPage,
      },
    });
  } catch (err) {
    res.status(500)
      .json({ errors: ['Error fetching users.'] });
  }
};

export const updateUserSetting = async (req, res) => {
  const { setting } = req.params;
  const { theme } = req.body;

  if (setting !== 'theme') {
    return res.status(400)
      .json({ errors: [`Invalid setting: ${setting}.`] });
  }

  try {
    const updatedUser = await userService.updateUserSetting(req.params.id, theme);
    return res.json({ data: { theme: updatedUser.settings.theme } });
  } catch (err) {
    return res.status(500)
      .json({ errors: [err.message] });
  }
};

export const updateUserVCard = async (req, res) => {
  const {
    contact,
    location,
    person,
    professional,
    socialMedia,
    category,
  } = req.body;
  const { id: userId } = req.params;

  try {
    const sanitizedBio = sanitizeHtml(professional.bio, sanitizeOptions);

    const updatedUser = await userService.updateUserVCard(userId, {
      contact,
      location,
      person,
      professional: {
        ...professional,
        bio: sanitizedBio,
      },
      socialMedia,
      category,
    });

    return res.json({ data: { vCardSchema: updatedUser.vCard } });
  } catch (err) {
    return res.status(500).json({ errors: [err.message] });
  }
};

export const getVCard = async (req, res) => {
  try {
    const vCard = await userService.getVCard(req.params.id);
    return res.json({ data: vCard });
  } catch (err) {
    return res.status(404)
      .json({ errors: ['User not found.'] });
  }
};

export const getVcf = async (req, res) => {
  try {
    const vcf = await userService.getVcf(req.params.id, req.query.v);
    const userAgent = req.get('User-Agent') || '';
    const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);

    res.setHeader('Content-Type', 'text/vcard; charset=utf-8');
    if (!isMobile) {
      res.setHeader('Content-Disposition', `attachment; filename="${vcf.filename}"`);
    }

    return res.send(vcf.content);
  } catch (err) {
    return res.status(404)
      .json({ errors: ['User not found.'] });
  }
};

export const bulkImportUsers = async (req, res) => {
  try {
    const csvFile = req.files?.file || req.files?.csv;

    if (!csvFile) {
      return res.status(400)
        .json({ errors: ['CSV file is required.'] });
    }

    const maxBytes = 5 * 1024 * 1024;
    if (csvFile.size > maxBytes) {
      return res.status(400)
        .json({ errors: ['CSV file must be 5 MB or smaller.'] });
    }

    const fileName = String(csvFile.name || '').toLowerCase();
    if (!fileName.endsWith('.csv')) {
      return res.status(400)
        .json({ errors: ['Only CSV files are allowed.'] });
    }

    const csvText = csvFile.data.toString('utf8');
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => String(header || '').trim().toLowerCase(),
    });

    if (parsed.errors.length > 0 && (!parsed.data || parsed.data.length === 0)) {
      return res.status(400)
        .json({ errors: ['Unable to parse CSV file.'] });
    }

    if (parsed.data.length > 1000) {
      return res.status(400)
        .json({ errors: ['CSV files cannot contain more than 1000 rows.'] });
    }

    const result = await userService.bulkCreateUsers(parsed.data);
    return res.json(result);
  } catch (err) {
    return res.status(500)
      .json({ errors: [err.message || 'Error importing users.'] });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    return res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    return res.status(404)
      .json({ errors: ['User not found.'] });
  }
};

export const uploadImage = async (req, res) => {
  try {
    const image = req.files?.image;
    const { imageHeight } = req.body;
    const imageName = req.body.imageName || 'avatar';
    const { id } = req.params;

    if (!image) {
      return res.status(400)
        .json({ errors: ['No image file provided.'] });
    }

    await userService.uploadImage(id, image, imageHeight, imageName);
    return res.json('Success');
  } catch (err) {
    return res.status(500)
      .json({ errors: ['Error uploading image.'] });
  }
};
