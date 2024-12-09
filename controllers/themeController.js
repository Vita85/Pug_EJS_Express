const themeController = {
  getTheme(req, res) {
    const chooseTheme = req.cookies.theme || "light";
    res.render("theme", { chooseTheme });
  },

  setTheme(req, res) {
    const { theme } = req.body;
    console.log("Theme: ", theme);
    if (theme === "light" || theme === "dark") {
      res.cookie("theme", theme, { maxAge: 900000, httpOnly: true });
      console.log("Theme saved in cookie:", theme);
      res.redirect("/theme");
    } else {
      console.log("Theme not found", theme);
      res.status(400).send("Not found theme");
    }
  },
};

module.exports = themeController; 