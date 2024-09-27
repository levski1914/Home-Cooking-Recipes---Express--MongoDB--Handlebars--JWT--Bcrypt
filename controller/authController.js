const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const { guestsOnly } = require("../middlewares/routeGuards");
const authService = require("../services/authService");
const { parseError } = require("../utils/getErrorMessage");
router.get("/register", guestsOnly, (req, res) => {
  res.render("auth/register");
});

router.post(
  "/register",
  guestsOnly,
  body("username")
    .trim()
    .isLength({ min: 2, max: 10 })
    .withMessage("username must between 2 and 10 characters"),
  body("email")
    .trim()
    .isEmail()
    .isLength({ min: 10 })
    .withMessage("email must be at least 10 characters"),
  body("password")
    .trim()
    .isLength({ min: 4 })
    .withMessage("passwords must be at least 4 characters"),
  body("rePassword")
    .trim()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("passwords don't match"),

  async (req, res) => {
    const userData = req.body;
    try {
      const validation = validationResult(req);
      if (!validation.error) {
        throw validation.errors;
      }
      const token = await authService.register(userData);

      res.cookie("auth", token);

      res.redirect("/");
    } catch (err) {
      res.render("auth/register", {
        error: parseError(err).errors,
      });
    }
  }
);

router.get("/login", (req, res) => {
  res.render("auth/login");
});
router.post("/login", async (req, res) => {
  const loginData = req.body;
  try {
    const token = await authService.login(loginData);

    res.cookie("auth", token);
    res.redirect("/");
  } catch (err) {
    res.render("auth/login", { error: parseError(err) });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("auth");
  res.redirect("/");
});
module.exports = router;
