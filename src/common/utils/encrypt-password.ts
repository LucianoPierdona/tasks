import * as bcrypt from 'bcrypt';

export const encryptPassword = async (password: string) => {
  const saltOrRounds = 10;

  return await bcrypt.hash(password, saltOrRounds);
};
