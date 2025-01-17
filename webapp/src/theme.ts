// Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { PaletteMode, Theme, alpha } from "@mui/material";

// color design tokens export
export const tokens = (mode: PaletteMode) => ({
  ...(mode === "dark"
    ? {
        grey: {
          100: "ffffff",
          200: "#e0e0e0",
          300: "#666666",
          400: "#3d3d3d",
          500: "#141414",
          600: "#000000",
        },
        primary: {
          100: "#FF7300",
        },
      }
    : {
        grey: {
          100: "#000000",
          200: "#141414",
          300: "#666666",
          400: "#a3a3a3",
          500: "#e0e0e0",
          600: "#ffffff",
        },
        primary: {
          100: "#FF7300",
        },
      }),
});

// mui theme settings
export const themeSettings = (mode: PaletteMode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              main: colors.primary[100],
              contrastText: colors.grey[100],
            },
            secondary: {
              dark: colors.grey[600],
              main: colors.grey[200],
              light: colors.grey[200],
            },
            background: {
              default: colors.grey[500],
            },
          }
        : {
            // palette values for light mode
            primary: {
              main: colors.primary[100],
              contrastText: colors.grey[600],
            },
            secondary: {
              light: colors.grey[400],
              dark: colors.grey[300],
              main: colors.grey[200],
              contrastText: colors.grey[100],
            },
            background: {
              default: colors.grey[600],
            },
            header: {
              header: "#F1F7FF",
            },
          }),
    },
    typography: {
      fontSize: 13,
      fontFamily: ["Poppins", "sans-serif"].join(","),
      h1: {
        fontSize: 40,
      },
      h2: {
        fontSize: 32,
      },
      h3: {
        fontSize: 24,
      },
      h4: {
        fontSize: 20,
      },
      h5: {
        fontSize: 16,
      },
      h6: {
        fontSize: 14,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {},
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiInputBase-root": {
              size: "small",
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          root: {
            backdropFilter: "blur(5px)",
          },
          paper: {
            width: "90vw",
            borderRadius: 1,
            maxHeight: "90vh",
            "& .MuiDialogTitle-root": {
              fontWeight: "bold",
            },
          },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            border: "none",
            pb: 0,
            height: `calc(100% - 40px)`,
            width: "100%",
            borderTop: 1,
            borderColor: "black",
            "&.MuiDataGrid-root": {
              borderRadius: 0,
              borderTop: 1,
              borderColor: "black",
            },
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-cell:focus-within": {
              outline: "none",
            },
            "& .MuiDataGrid-columnHeader:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-columnHeader-within": {
              outline: "none",
            },
            "& .MuiDataGrid-columnHeader:focus-within": {
              outline: "none",
            },
            ".MuiDataGrid-row:focus": {
              backgroundColor: (theme: Theme) =>
                alpha(
                  theme.palette.info.main,
                  theme.palette.action.activatedOpacity
                ),
              borderRadius: 0,
            },
            "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer":
              {
                display: "none",
              },
            ".MuiDataGrid-columnHeaderTitle": {
              fontWeight: 300,
            },
          },
          columnHeader: {
            backgroundColor: alpha(colors.primary[100], 0.1),
            borderRadius: 0,
            fontWeight: 500,
          },
          columnHeaderTitle: {
            fontWeight: 500,
          },
        },
      },
    },
  };
};
