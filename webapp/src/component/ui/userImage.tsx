import { AppConfig } from "@config/config";
import { APIService } from "@utils/apiService";
import { EmployeeInfo } from "@utils/types";
import React from "react";

function UserImage(props: {
  isRound? : boolean;
  email: string;
  src?: string;
  size: number;
  name: string;
  variant?: "rounded" | "circular" | "square" | undefined;
}) {
  const [url, setUrl] = React.useState<string>(
    props.src ??
      "https://ui-avatars.com/api/?name=" +
        props.name +
        "&background=0D8ABC&color=fff&size=128"
  );

  React.useEffect(() => {
    if (!props.src) {
      APIService.getInstance()
        .get<{ employeeInfo: EmployeeInfo }>(
          AppConfig.serviceUrls.getEmployeeHistory +
          "?employeeWorkEmail=" +
          props.email
        )
        .then((response) => {
          if (response.data.employeeInfo.employeeThumbnail) {
            setUrl(response.data.employeeInfo.employeeThumbnail);
          } else {
            setUrl(
              "https://ui-avatars.com/api/?name=" +
              props.name +
              "&background=0D8ABC&color=fff&size=128"
            );
          }
        });
    } else { 
      setUrl(props.src)
    }
  }, [props.src]);

  return (
    <>
      <img
        style={{ borderRadius: props.isRound ? "50%":"5%", height: props.size, width: props.size, }}
        referrerPolicy="no-referrer"
        alt={props.name}
        loading="lazy"
        src={url.replace('=s100','=s500')}
        
      />
    </>
  );
}

export default UserImage;
