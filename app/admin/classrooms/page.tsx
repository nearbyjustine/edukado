import { fetchAllClassrooms } from "@/actions/section/fetch-classroom";
import ClassroomsTable from "@/components/admin-table/classroom-table";
import CreateClassroomButton from "@/components/buttons/create-classroom-button";
import { Classroom } from "@/lib/collection.types";
import React from "react";

const AdminClassroomPage = async () => {
  return (
    <div className='mt-10 pb-20'>
      <CreateClassroomButton />
      <ClassroomsTable />
    </div>
  );
};

export default AdminClassroomPage;
