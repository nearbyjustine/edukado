import { ClipboardList } from "lucide-react";

const Activity = ({ name, activity, date }: { name: string; activity: string; date: string }) => {
  return (
    <div className='flex gap-4 items-center py-2 px-6 border rounded-md '>
      <div className='bg-green-500 rounded-3xl h-auto w-auto p-2 text-white'>
        <ClipboardList width={25} height={25} className='' />
      </div>
      <div className='flex flex-col'>
        <p className='font-semibold'>
          {name} posted a new assignment: <span className='italic'>{activity}</span>
        </p>
        <p>{date}</p>
      </div>
    </div>
  );
};

export default Activity;
