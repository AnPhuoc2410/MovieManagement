import React, { memo } from "react";
import MainLayout from "../MainLayout/MainLayout";

interface Props {
  children?: React.ReactNode;
}

const ShowTimeLayoutInner: React.FC<Props> = ({ children }) => {
  return <MainLayout>{children}</MainLayout>;
};

const ShowTimeLayout = memo(ShowTimeLayoutInner);

export default ShowTimeLayout;
