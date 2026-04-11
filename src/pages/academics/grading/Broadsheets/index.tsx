import { useGetClassesQuery } from "@/services/leApi/classApi";
import { useGetSchoolArmsQuery } from "@/services/leApi/armsApi";

const Broadsheets = () => {
  const { data: classes = [] } = useGetClassesQuery();
  const { data: arms = [] } = useGetSchoolArmsQuery();

  console.log('classes', classes);
  console.log('arms', arms);
  return (
    <div>
      <h1>Broadsheets</h1>
    </div>
  );
};

export default Broadsheets;