import * as bcrypt from 'bcryptjs';

export const encryptPassword = async (password: string) => {
  const saltOrRounds = 10;

  return await bcrypt.hash(password, saltOrRounds);
};
