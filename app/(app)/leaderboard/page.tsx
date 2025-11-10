import LeaderBoardList from "@/components/ui/leaderboard/LeaderBoardList";
import PageHeading from "@/components/ui/shared/PageHeading";
import React from "react";

const LeaderboardPage = () => {
  return (
    <>
      <PageHeading
        title="Leaderboard"
        description="See the top performers in the ACTXION Leaderboard. The most active users in the ACTXION ecosystem."
      />
      <LeaderBoardList />
    </>
  );
};

export default LeaderboardPage;
