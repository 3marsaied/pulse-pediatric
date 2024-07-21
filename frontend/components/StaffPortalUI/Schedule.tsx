import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];
interface Appointment {
  id: number,
  patientFirstName: string,
  parentFirstName: string,
  parentLastName: string,
  doctorFirstName: string,
  doctorLastName: string,
  doctorId: number,
  appointmentDate: string,
  From: string,
  To: string
}
const Schedule = () => {
  
  const [appointments, setAppointments] = React.useState([] as Appointment[]) 
  React.useEffect(() => {
    async function fetchData() {
      const data = await fetchAppointmentList()
      setAppointments(data)
    }
    fetchData()
  }, []);
  async function fetchAppointmentList() {
    try{
      const request = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_NAME}/get/all/appointments/${localStorage.getItem('userId')}?token=${localStorage.getItem("accessToken")}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      })
      return request.data
    }catch(err){
      console.log(err)
    }
  }
  return (
    <div className= 'm-5 w-screen  flex-col'>
       <TableContainer   component={Paper}>
      <Table sx={{ minWidth: 600 }} aria-label="simple table">
        <TableHead>
          <TableRow >
            <TableCell  > <span className=' text-orange-500 text-lg font-semibold '>Patient Name</span></TableCell>
            <TableCell align="right"><span className=' text-orange-500 text-lg font-semibold '>Day</span></TableCell>
            <TableCell align="right"><span className=' text-orange-500 text-lg font-semibold '>From</span></TableCell>
            <TableCell align="right"><span className=' text-orange-500 text-lg font-semibold '>To</span></TableCell>
            <TableCell align="right"><span className=' text-orange-500 text-lg font-semibold '>Doctor</span></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            > 
              <TableCell component="th" scope="row">
                {row.patientFirstName}{" "}{row.parentFirstName} 
              </TableCell>
              <TableCell align="right">{row.appointmentDate}</TableCell>
              <TableCell align="right">{row.From}</TableCell>
              <TableCell align="right">{row.To}</TableCell>
              <TableCell align="right">{row.doctorFirstName}{" "}{row.doctorLastName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  )
}

export default Schedule
