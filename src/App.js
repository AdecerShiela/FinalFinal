import React, { Component } from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.css';
import httpClient from 'axios'
import {
    Button,ButtonGroup,
    Form,FormGroup,ControlLabel,
    FormControl,HelpBlock,
    Checkbox,Radio,Grid,Row,Col,
    Table,Modal,Panel
} from 'react-bootstrap';


class App extends Component {
    constructor(){
        super()
    }

    state = {
        name: "",
        Course: "",
        Subject:"",
         Status: "",
        movies: [],
       
        gender: "",
        suggest:"",
        records:[],
        show: false,
        selectedName: "",
        selectedCourse: "",
        selectedSubject:"",
        selectedStatus:"",
        selectedMovies: [],
        selectedGender: "",
        selectedsuggest: "",
        
        seledtedId: ""
    };

    componentDidMount(){

        this.refreshData();
    }

     refreshData=()=>{

         httpClient.get('http://localhost:3004/surveys')
             .then((response)=> {
                 var data =response.data;
                 this.setState({
                     records:data
                 })

             }).catch((error)=> {

             });

     };

    onChange = (fieldName)=> {
        return (event)=> {

            console.log(event.target.value);
            var state = this.state;
            state[fieldName] = event.target.value;
            this.setState(state);
        }
    };

    modalonChange = (fieldName)=> {
        return (event)=> {

            console.log(event.target.value);
            var state = this.state;
            state[fieldName] = event.target.value;
            this.setState(state);
        }
    };

    checkboxChange = (fieldName)=> {
        return (event)=> {
            var targetArray = this.state[fieldName];
            if (targetArray.indexOf(event.target.value) >= 0)
                targetArray.splice(
                    targetArray.indexOf(event.target.value),
                    1
                );
            else
                targetArray.push(event.target.value);

            var state = this.state;
            state[fieldName] = targetArray;
            this.setState(state);
        }
    };

    modalcheckboxChange = (fieldName)=> {
        return (event)=> {
            var targetArray = this.state[fieldName];
            if (targetArray.indexOf(event.target.value) >= 0)
                targetArray.splice(
                    targetArray.indexOf(event.target.value),
                    1
                );
            else
                targetArray.push(event.target.value);

            var state = this.state.selectedMovies;
            state[fieldName] = targetArray;
            this.setState(state.selectedMovies);
        }
    };


    saveSurvey = ()=> {

       
        var data = {name: this.state.name,
                    Course: this.state.Course,
                    Subject:this.state.Subject,
                    Status:this.state.Status,
                    gender: this.state.gender,
                    suggest:this.state.suggest,
                    movies: this.state.movies};
         console.log(data);
         delete data.records;

        httpClient.post('http://localhost:3004/surveys',
         data)
            .then((response)=> {
                this.refreshData();
            }).catch((error)=> {

            });
location.reload();
    };

    deleteItem = (id)=>{

        return ()=>{

            httpClient.delete('http://localhost:3004/surveys/'+ id )
                .then((response)=> {
                    console.log('delete');
                    this.refreshData();
                }).catch((error)=> {

                });

        };
    };
    
    editItem = (id) =>{
        return ()=> {
            
            httpClient.get('http://localhost:3004/surveys/'+id)
                .then((response)=> {
                    console.log('edit');
                    var data = response.data
                    console.log(response.data);
                    this.setState({
                        name: data.name,
                        Course: data.Course
                    })
                }).catch((error)=>{
                    
                });
        };
    };

    openModal = (id)=>{

            return ()=>{
                this.setState({
                    show: true
                })

                 httpClient.get('http://localhost:3004/surveys/'+id)
                .then((response)=> {
                    var data = response.data
                    this.setState({
                        selectedName: data.name,
                        selectedCourse: data.Course,
                        selectedSubject: data.Subject,
                        selectedStatus: data.Status,
                        selectedMovies: data.movies,
                        selectedGender: data.gender,
                        selectedsuggest:data.suggest,
                        selectedId: data.id
                    })
                    console.log(this.state.selectedData.name);
                }).catch((error)=>{
                    
                });

            };
        };

    

    saveEdit = (id) =>{


        return () => {
            console.log(data);
            var data = {name: this.state.selectedName,
                        Course: this.state.selectedCourse,
                        Subject:this.state.selectedSubject,
                        Status:this.state.selectedStatus,
                        gender: this.state.selectedGender,
                        suggest: this.state.selectedsuggest,
                        movies: this.state.selectedMovies};
            delete data.records;

            httpClient.patch('http://localhost:3004/surveys/'+id,
            data)
                .then((response)=> {
                    this.refreshData();
                }).catch((error)=> {

                });

            this.setState({
                show: false,
                selectedCourse: "" ,
                selectedSubject: "" ,
                selectedStatus: "" ,
                selectedGender: "" ,
                selectedsuggest:"",
                selectedMovies: [] ,
                selectedName: ""
            });
        }
    };

    render() {

        var rows  = this.state.records.map((item,i)=>{

            return (
                <tr key={i}>
                     <td><Button  bsStyle="warning" onClick={this.deleteItem(item.id)}>Delete</Button></td>
                     <td><Button  bsStyle="warning" onClick={this.openModal(item.id)}>Edit</Button></td>
                     <td>{item.id}</td>
                     <td>{item.name}</td>
                     <td>{item.Course}</td>
                     <td>{item.Subject}</td>
                     <td>{item.Status}</td>
                     <td>{
                         item.movies.map((movies, mi)=> {
                             return <div key={mi}>
                                   <span className="label label-info">{movies}</span>
                                 </div>
                         })

                      }
                     </td>
                    
                     <td>{item.gender}</td>
                     <td className="textfieldarea">{item.suggest}</td>
                </tr>
            );
        });
        
        let close = () => this.setState({ show: false })



        return (
            <div className="container">
                <h1> {this.state.suway} </h1>
                <div className="page-header">
                 <div className="header">
                  Student Side
                  </div>
                </div>
                <div className="jumbotron">
                   
                                <Form>
                                
                                <Panel>
                                <Grid>
                                <Row>
                                <Col md={6}>
                                
                                <FormGroup>
                                    
                                        <ControlLabel>Complete Name ...</ControlLabel>
                                        <FormControl
                                            type="text"
                                            placeholder="Name here..."
                                            value={this.state.name}
                                            onChange={this.onChange('name')}
                                      />
                                       
                                    </FormGroup>
                                </Col>
                                
                                <Col md={6}>
                                <FormGroup>
                                        <ControlLabel>Course ...</ControlLabel>
                                        <FormControl
                                            type="text"
                                            placeholder="Course here..."
                                            value={this.state.Course}
                                            onChange={this.onChange('Course')}
                                             />
                                      
                                      
                                    </FormGroup>
                                </Col>
                                </Row>
                                
                                </Grid>
                               
                               <Grid>
                               <Row>
                               
                              <Col md={6}>
                              
                              
                              
                               <FormGroup>
                                    
                                        <ControlLabel>Subject:</ControlLabel>
                                        <FormControl componentClass="select"
                                                     placeholder="Subject here..."
                                                     value={this.state.Subject}
                                                     onChange={this.onChange('Subject')}
                                            >
                                            <option value="Java">Java</option>
                                            <option value="DBMS">DBMS</option>
                                            <option value="Javascript">Javascript</option>
                                            <option value="SQL">SQL</option>
                                            
                                            
                                        </FormControl>
                                        
                                    </FormGroup>
                              
                              
                              
                              </Col>
                               <Col md={6}>
                               
                               <FormGroup>
                                    
                                   <ControlLabel>Major:</ControlLabel>
                                        <FormControl componentClass="select"
                                                     placeholder="Major here..."
                                                     value={this.state.Status}
                                                     onChange={this.onChange('Status')}
                                            >
                                            <option value="Multimedia">Multimedia</option>
                                            <option value="Programming">Programming</option>
                                            <option value="Photography">Photography</option>
                                            
                                            
                                            
                                        </FormControl>
                                    
                                        
                                    </FormGroup>
                               
                               
                               
                              </Col>
                               </Row>
                               
                               </Grid>
                            </Panel>
                            
                            <Panel>
                                    <FormGroup>
                                      
                                       
                                       <ControlLabel>Choose Teacher</ControlLabel> <Table condensed striped bordered hover>
                                 <tbody>     <tr><td>  <Checkbox value="Spike Cuizon"
                                                  checked={this.state.movies.indexOf('Spike Cuizon')>=0 ? true:false}
                                                  onChange={this.checkboxChange('movies')}>
                                           Spike Cuizon
                                        </Checkbox></td>
                                     <td>   <Checkbox value="Angie Garde"
                                                  checked={this.state.movies.indexOf('Angie Garde')>=0 ? true:false}
                                                  onChange={this.checkboxChange('movies')}>
                                           Angie Garde
                                        </Checkbox></td>
                                  <td>      <Checkbox value="Albert Oclarit"
                                                  checked={this.state.movies.indexOf('Albert Oclarit')>=0 ? true:false}
                                                  onChange={this.checkboxChange('movies')}>
                                           Albert Oclarit
                                        </Checkbox></td>
                                        
                                       
                                      <td>   <Checkbox value="Wyng Auxtero"
                                                  checked={this.state.movies.indexOf('Wyng Auxtero')>=0 ? true:false}
                                                  onChange={this.checkboxChange('movies')}>
                                       Wyng Auxtero
                                        </Checkbox></td></tr></tbody></Table>
                                                     
                                         
                                    </FormGroup>
                                    
                                    <FormGroup>
                                     
                                       
                                    <ControlLabel>Rate 1-4 the teacher you choose according to their skills: </ControlLabel><Table condensed striped bordered hover>
                                      <tbody>     <tr><td>   <Radio name="gender" value="1-Excellent"
                                               onChange={this.onChange('gender')}>1-Excellent</Radio></td>
                                    <td>    <Radio name="gender" value="2-VerySatisFactory"
                                               onChange={this.onChange('gender')}>2-Very SatisFactory</Radio></td>
                                     <td>       <Radio name="gender" value="3-Satisfactory"
                                          
                                               onChange={this.onChange('gender')}>3-Satisfactory</Radio></td>
                                               
                                             <td>   <Radio name="gender" value="4-Poor"
                                          
                                               onChange={this.onChange('gender')}>4-Poor</Radio></td>
                                               </tr></tbody></Table>
                                               
                                               
                                    </FormGroup>
                                    
                                    <FormGroup>
                                    <ControlLabel>Write youre Comments:</ControlLabel><br/>
                                    <textarea
                                    type="textarea"
                                    placeholder=""
                                    onChange={this.onChange('suggest')}
                                    cols="109"
                                    rows="7"
                                    />
                                    </FormGroup>
                                    
                                    <div className="buttoncenter">
                                    <ButtonGroup>
                                        <Button bsStyle="primary" bsSize="large" onClick={this.saveSurvey}>Save Survey</Button>
                                    </ButtonGroup>
                                    </div>
                            </Panel>
                                    
                                </Form>
                                
                                 </div>
                           
                               <Panel>
                                <Table condensed striped bordered hover>
                                    <thead>
                                    <tr>
                                        <th>Delete</th>
                                        <th>Edit</th>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Student Course</th>
                                        <th>Subject</th>
                                         <th>Major</th>
                                        <th>Teacher</th>
                                        <th>Ratings</th>
                                        <th>Comments</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {rows}
                                    </tbody>
                                </Table>
                               </Panel>

               
                 <div className="modal-container" style={{height: 200}}>
                    <Modal
                    show={this.state.show}
                    onHide={close}
                    container={this}
                    aria-labelledby="contained-modal-title"
                    >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title">Contained Modal</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                   
                    <Form>
                 
                               <Table>
                               <tr>
                               <td>
                              
                                <FormGroup>
                                    
                                        <ControlLabel>Complete Name ...</ControlLabel>
                                        <FormControl
                                            type="text"
                                            placeholder="Name here..."
                                            value={this.state.selectedname}
                                            onChange={this.modalonChange('selectedName')}
                                      />
                                       
                                    </FormGroup></td>
                               <td>
                                
                                
                             
                                <FormGroup>
                                        <ControlLabel>Course ...</ControlLabel>
                                        <FormControl
                                            type="text"
                                            placeholder="Course here..."
                                            value={this.state.selectedCourse}
                                            onChange={this.modalonChange('selectedCourse')}
                                             />
                                      
                                      
                                    </FormGroup></td>
                              </tr>
                              <tr>
                              <td>
                              
                               <FormGroup>
                                    
                                        <ControlLabel>Subject:</ControlLabel>
                                        <FormControl componentClass="select"
                                                     placeholder="Subject here..."
                                                     value={this.state.selectedSubject}
                                                     onChange={this.modalonChange('selectedSubject')}
                                            >
                                            <option value="Java">Java</option>
                                            <option value="DBMS">DBMS</option>
                                            <option value="Javascript">Javascript</option>
                                            <option value="SQL">SQL</option>
                                            
                                            
                                        </FormControl>
                                        
                                    </FormGroup></td>
                              
                              
                              
                             
                               
                               <td>
                               <FormGroup>
                                    
                                   <ControlLabel>Major:</ControlLabel>
                                        <FormControl componentClass="select"
                                                     placeholder="Major here..."
                                                     value={this.state.selectedStatus}
                                                     onChange={this.modalonChange('selectedStatus')}
                                            >
                                            <option value="Multimedia">Multimedia</option>
                                            <option value="Programming">Programming</option>
                                            <option value="Photography">Photography</option>
                                            
                                            
                                            
                                        </FormControl>
                                    
                                        
                                    </FormGroup>
                               </td></tr></Table>
                               
                                    <FormGroup>
                                      
                                       
                                       <ControlLabel>Choose Teacher</ControlLabel> <Table condensed striped bordered hover>
                                 <tbody>     <tr><td>  <Checkbox value="Spike Cuizon"
                                                  checked={this.state.selectedMovies.indexOf('Spike Cuizon')>=0 ? true:false}
                                                  onChange={this.modalcheckboxChange('selectedMovies')}>
                                           Spike Cuizon
                                        </Checkbox></td>
                                     <td>   <Checkbox value="Angie Garde"
                                                  checked={this.state.selectedMovies.indexOf('Angie Garde')>=0 ? true:false}
                                                  onChange={this.modalcheckboxChange('selectedMovies')}>
                                           Angie Garde
                                        </Checkbox></td>
                                  <td>      <Checkbox value="Albert Oclarit"
                                                  checked={this.state.selectedMovies.indexOf('Albert Oclarit')>=0 ? true:false}
                                                  onChange={this.modalcheckboxChange('selectedMovies')}>
                                           Albert Oclarit
                                        </Checkbox></td>
                                        
                                       
                                      <td>   <Checkbox value="Wyng Auxtero"
                                                  checked={this.state.selectedMovies.indexOf('Wyng Auxtero')>=0 ? true:false}
                                                  onChange={this.modalcheckboxChange('selectedMovies')}>
                                       Wyng Auxtero
                                        </Checkbox></td></tr></tbody></Table>
                                                     
                                         
                                    </FormGroup>
                                    
                                    <FormGroup>
                                     
                                       
                                    <ControlLabel>Rate 1-4 the teacher you choose according to their skills: </ControlLabel><Table condensed striped bordered hover>
                                      <tbody>     <tr><td>   <Radio name="selectedGender" value="1-Excellent"
                                               onChange={this.modalonChange('selectedGender')}>1-Excellent</Radio></td>
                                    <td>    <Radio name="selectedGender" value="2-VerySatisFactory"
                                               onChange={this.modalonChange('selectedGender')}>2-Very SatisFactory</Radio></td>
                                     <td>       <Radio name="selectedGender" value="3-Satisfactory"
                                          
                                               onChange={this.modalonChange('selectedGender')}>3-Satisfactory</Radio></td>
                                               
                                             <td>   <Radio name="selectedGender" value="4-Poor"
                                          
                                               onChange={this.modalonChange('selectedGender')}>4-Poor</Radio></td>
                                               </tr></tbody></Table>
                                               
                                               
                                    </FormGroup>
                                    
                                    <FormGroup>
                                    <ControlLabel>Write youre Comments:</ControlLabel><br/>
                                    <textarea
                                    type="textarea"
                                    placeholder=""
                                    onChange={this.modalonChange('selectedsuggest')}
                                    cols="60"
                                    rows="4"
                                    />
                                    </FormGroup>
                                    
                                    
                                    <ButtonGroup vertical block>
                                    
                                    

                                        <Button bsStyle="primary" bsSize="large" onClick={this.saveEdit(this.state.selectedId)} block>Save Survey</Button>

                                    </ButtonGroup>
                    
                                            </Form>
                            </Modal.Body>
                        </Modal>
                        </div>
            </div>
        );
    }
}

export default App;
