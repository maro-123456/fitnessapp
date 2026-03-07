// Vérifie le rôle de l'utilisateur (ex: admin)
const roleMiddleware = (role) => {
  return (req, res, next) => {
    if (req.userRole !== role) {
      return res.status(403).json({ message: "Accès refusé : rôle insuffisant" });
    }
    next();
  };
};

module.exports = roleMiddleware;