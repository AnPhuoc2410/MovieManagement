import React, { memo } from "react";
import UserDetailLayout from "../UserDetailLayout/UserDetailLayout";

interface Props {
  children?: React.ReactNode;
}

const ShowTimeLayoutInner: React.FC<Props> = ({ children }) => {
  return <UserDetailLayout>{children}</UserDetailLayout>;
};

const ShowTimeLayout = memo(ShowTimeLayoutInner);

export default ShowTimeLayout;
