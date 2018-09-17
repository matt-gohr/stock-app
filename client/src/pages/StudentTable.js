import React, { Component } from 'react';
import {BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import generateData from "../generateDate";

const data = generateData(100);

class ReactBootstrapTable extends Component {

    state = {
        data: generateData (50, false)
    };

    removeItem = itemId => {
        this.setState({
            data: data.fliter(item => item.id !==itemId)
        });

    }
    
    render() {
        const { data } = this.state;
        const options ={
            sizePerPage: 10,
            prePage: 'Previous',
            nextPage: 'First',
            lastPage: 'Last',
            hideSizePerPage: true,
        };

        return (
            <div className="container-fluid">
            <div className="row">    
              <div className="col-md-12">    
                <div className="card">
    
                  <div className="header">
    
                    <h4>Student Table</h4>
    
                  </div>
    
                  <div className="content">
    
                    <BootstrapTable
    
                      data={data}
    
                      bordered={false}
    
                      striped
    
                      pagination={true}
    
                      options={options}>
    
                      <TableHeaderColumn
    
                        dataField='id'
    
                        isKey
    
                        width="50px"
    
                        dataSort>
    
                        ID
    
                      </TableHeaderColumn>
    
                      <TableHeaderColumn
    
                        dataField='name'
    
                        width="15%"
    
                        filter={ { type: 'TextFilter'} }
    
                        dataSort>
    
                        Student
    
                      </TableHeaderColumn>
    
                      <TableHeaderColumn
    
                        dataField='Profile Balance'
    
                        width="15%"
    
                        dataSort>
    
                        Profile Balance
    
                      </TableHeaderColumn>
    
                      <TableHeaderColumn
    
                        dataField='Total Return'
    
                        width="15%"
    
                        dataSort>
    
                        Total Return
    
                      </TableHeaderColumn>
    
                      <TableHeaderColumn
    
                        dataField='Percent Return'
    
                        width="15%">
    
                        Percent Return
    
                      </TableHeaderColumn>
    
                      <TableHeaderColumn
    
                        dataField='Description'
    
                        width="30%">
    
                        Description
    
                      </TableHeaderColumn>
    
                      <TableHeaderColumn width="20%"></TableHeaderColumn>
    
                    </BootstrapTable>
    
                  </div>    
                </div>    
              </div>    
            </div>    
          </div>
        );
    }
}

export default StudentTable