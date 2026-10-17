export const userDTO = (user) => ({
  userId: user.userId,
  themeId: user.themeId,
  name: user.name,
  email: user.email,
  role: user.role,
  category: user.category || 'other',
});

export const usersDTO = (users) => users.map((user) => userDTO(user));

export const usersByPageLimitAndSearchQueryDTO = (
  users,
  totalUsers,
  totalPages,
  nextPage,
  prevPage,
) => ({
  users: usersDTO(users),
  totalUsers,
  totalPages,
  nextPage,
  prevPage,
});
