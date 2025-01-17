import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { APIService } from "@utils/apiService";
import { AppConfig } from "@config/config";
import { Employee } from "@utils/types";

export default function EmployeeSelector(props: {
  isLeadsOnly: boolean;
  setValue: (value: Employee | null) => void;
  value?: Employee | null;
  disabled?: boolean;
  exclude?: string[];
}) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<readonly Employee[]>([]);
  const loading = open && options.length === 0;

  React.useEffect(() => {
    if (!loading || options.length > 0) {
      return undefined;
    }

    (async () => {
      APIService.getInstance()
        .get<{ employees: Employee[] }>(
          AppConfig.serviceUrls.retrieveEmployeeList +
            "?filterLeads=" +
            props.isLeadsOnly
        )
        .then((resp) => {
          if (resp.status === 200) {
            var employees: Employee[] = [];

            //select employee with unique email address
            resp.data.employees.forEach((employee) => {
              if (
                !employees.some((emp) => emp.workEmail === employee.workEmail)
              ) {
                employees.push(employee);
              }
            });

            setOptions(employees);
          } else {
            setOptions([]);
          }
        })
        .catch((error: Error) => {
          setOptions([]);
        });
    })();
  }, [loading, options.length, props.isLeadsOnly]);

  return (
    <Autocomplete
      isOptionEqualToValue={(option, value) => {
        return option.workEmail.startsWith(value.workEmail);
      }}
      open={open}
      style={{
        display: "flex",
        alignItems: "center",
      }}
      sx={{ width: 300 }}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      value={props.value}
      size="small"
      onChange={(_, value) => {
        props.setValue(value);
      }}
      disabled={props.disabled}
      getOptionLabel={(option) => option.workEmail}
      options={options.filter(
        (option) => !props.exclude?.includes(option.workEmail)
      )}
      loading={loading}
      renderInput={(params) => (
        <TextField
          name="email"
          {...params}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}
