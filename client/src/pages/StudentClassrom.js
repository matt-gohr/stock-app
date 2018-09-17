import react from 'react';
import Nasdaq from './Nasdaq';
import StudentTable from './StudentTable';

const Charts = () => (
    <div className="content">

    <div className="container-fluid">

      <div className="row">
      <div className="col-md-12">

          <Nasdaq />

        </div>
        <div className="col-md-12">

          <StudentTable />

        </div>
        </div>

</div>

</div>

);

export default StudentClassroom