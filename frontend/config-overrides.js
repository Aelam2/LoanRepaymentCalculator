const { override, fixBabelImports, addLessLoader } = require("customize-cra");

const darkBlue = {
  // ANTD-MOBILE
  white: "#fff",
  "brand-primary": "#fc5c9c",

  // ANTD
  "primary-color": "#fc5c9c",
  "secondary-color": "#43dde6",

  "layout-header-background": "#3E587B",
  "border-color-split": "#374d6b",

  "menu-bg": "#3E587B",
  "dropdown-menu-bg": "#3E587B",
  "menu-item-active-bg": "#00000021",
  "item-hover-bg": "#00000021",

  "layout-sider-background-light": "#3E587B",
  "layout-body-background": "#364f6b",

  "component-background": "#304863",
  "heading-color": "#fff",

  "text-color": "#fff",
  "text-color-secondary": "fade(@white, 85%)"
};

let theme = darkBlue;
let lessVariables = {};
let sassVariables = {};

for (let variable of Object.keys(theme)) {
  lessVariables[`@${variable}`] = theme[variable];
  sassVariables[`$${variable}`] = theme[variable];
}

module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true
  }),

  fixBabelImports("mobileImport", {
    libraryName: "antd-mobile",
    libraryDirectory: "es",
    style: true
  }),

  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      ...lessVariables
    }
  })
);
