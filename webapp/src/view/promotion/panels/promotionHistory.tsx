import React from "react";

import { Box} from "@mui/material";
import { useAppSelector, RootState } from "@slices/store";
import PromotionTimeLine from "@component/promotion/timeline";

export default function PromotionHistory() {

  const auth = useAppSelector((state: RootState) => state.auth);

  return (
    <>
      

      <Box
        className="panel-con"
        sx={{ height: "calc(100vh - 495px)", minHeight: "calc(580px)" }}
      >
       
        {auth.userInfo?.email && (
          <PromotionTimeLine employeeEmail={auth.userInfo?.email} />
        )}

      </Box>
    </>
  );
}
