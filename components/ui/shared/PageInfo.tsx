import React from "react";

const PageInfo = ({ title }: { title: string }) => {
  const uppercaseTitle = title.toUpperCase();
  return (
    <div className="flex justify-center">
      <h2 className="text-base/7 font-semibold text-indigo-500 bg-gray-100 px-8 text-uppercase rounded-full w-fit">
        {uppercaseTitle}
      </h2>
    </div>
  );
};

export default PageInfo;
