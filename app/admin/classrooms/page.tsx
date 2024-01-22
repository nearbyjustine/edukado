import { fetchAllClassrooms } from "@/actions/section/fetch-classroom";
import ClassroomsTable from "@/components/admin-table/classroom-table";
import { Classroom } from "@/lib/collection.types";
import React from "react";

const AdminClassroomPage = async () => {
  return (
    <div className='mt-10 pb-20'>
      <ClassroomsTable />
    </div>
  );
};

export default AdminClassroomPage;
