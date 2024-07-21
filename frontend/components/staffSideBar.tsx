interface StaffSideBarProps {
  setSection: (section: number) => void;
}

const StaffSideBar: React.FC<StaffSideBarProps> = ({ setSection }) => {
  return (
    <div className='bg-slate-200 w-72 h-96  m-5 rounded-lg flex-row font-black-500 shadow-md col-span-2 justify-center '>
      <div onClick={() => setSection(1)} className='p-2 m-5 cursor-pointer  rounded-full font-semibold text-gray-500 hover:bg-slate-50 hover:shadow-lg hover:transition duration-150 ease-linear'> Pick Appointment </div>
      <div onClick={() => setSection(2)} className='p-2 m-5 cursor-pointer  rounded-full font-semibold text-gray-500 hover:bg-slate-50 hover:shadow-lg hover:transition duration-150 ease-linear'> Schedule </div>
      
    </div>
  )
}

export default StaffSideBar
