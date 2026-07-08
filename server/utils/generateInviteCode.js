// Generates a short, human-friendly invite code like "7QK4P2XA"
const generateInviteCode = (length = 8) => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no O/0/I/1 to avoid confusion
  let code = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  return code;
};

module.exports = generateInviteCode;
