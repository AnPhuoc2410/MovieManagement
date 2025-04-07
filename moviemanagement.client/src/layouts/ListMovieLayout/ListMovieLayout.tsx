import React, { memo } from "react";
import UserDetailLayout from "../UserDetailLayout/UserDetailLayout";

interface Props {
  children: React.ReactNode;
}

const ListMovieLayoutInner: React.FC<Props> = ({ children }) => {
  return <UserDetailLayout>{children}</UserDetailLayout>;
};

const ListMovieLayout = memo(ListMovieLayoutInner);

export default ListMovieLayout;
