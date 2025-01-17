import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import UserInsertForm from "../forms/userInsertForm";
import UserEditForm from "../forms/userEditForm";

import { RootState, useAppSelector, useAppDispatch } from "@slices/store";
import { setDialogOpenState } from "@slices/adminSlices/users";
export default function UserFormDialog() {
  const dialogOpenState = useAppSelector(
    (state: RootState) => state.admin_users.isOpenInsertDialog
  );

  const currentEditUser = useAppSelector(
    (state: RootState) => state.admin_users.currentEditUser
  );
  
  const dispatch = useAppDispatch();

  return (
    <Dialog
      open={dialogOpenState}
      onClose={() => dispatch(setDialogOpenState(null))}
      maxWidth="xl"
      fullWidth={true}
    >
      <DialogTitle variant="h4">
        
          {currentEditUser ? "Edit System User" : "New System User"}
       
      </DialogTitle>
      <DialogContent>
        {currentEditUser ? <UserEditForm /> : <UserInsertForm />}
      </DialogContent>
    </Dialog>
  );
}
