import React, { Component } from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.css';
import httpClient from 'axios'
import {
    Button,ButtonGroup,
    Form,FormGroup,ControlLabel,
    FormControl,HelpBlock,
    Checkbox,Radio,Grid,Row,Col,
    Table,Modal
} from 'react-bootstrap';


class App extends Component {
    constructor(){
        super()
    }

    state = {
        name: "",
        color: "",
        movies: [],
        gender: "",
        records:[],
        show: false
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


    saveSurvey = ()=> {

        var data = this.state;
         delete data.records;

        httpClient.post('http://localhost:3004/surveys',
         data)
            .then((response)=> {
                this.refreshData();
            }).catch((error)=> {

            });

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
                        color: data.color
                    })
                }).catch((error)=>{
                    
                });
        };
    };


    render() {

        var rows  = this.state.records.map((item,i)=>{

            return (
                <tr key={i}>
                     <td><Button  bsStyle="warning" onClick={this.deleteItem(item.id)}>Delete</Button></td>
                     <td><Button  bsStyle="warning"  onMouseUp={() => this.setState({ show: true})} onMouseDown={this.deleteItem(item.id)}>Edit</Button></td>
                     <td>{item.id}</td>
                     <td>{item.name}</td>
                     <td>{item.color}</td>
                     <td>{
                         item.movies.map((movie, mi)=> {
                             return <div key={mi}>
                                   <span className="label label-info">{movie}</span>
                                 </div>
                         })

                      }
                     </td>
                     <td>{item.gender}</td>
                </tr>
            );
        });

        let close = () => this.setState({ show: false});

        return (
            <div className="container">
                <h1> {this.state.suway} </h1>
                <div className="page-header">
                    <h2>Student Survey!!!</h2>
                </div>
                <div className="jumbotron">
                    <Grid>
                        <Row>
                            <Col md={6}>
                                <Form>
                                    <FormGroup>
                                        <ControlLabel>Name please ...</ControlLabel>
                                        <FormControl
                                            type="text"
                                            placeholder="Name here..."
                                            value={this.state.name}
                                            onChange={this.onChange('name')}
                                            />
                                        <HelpBlock>use to identify you</HelpBlock>
                                    </FormGroup>
                                    <FormGroup>
                                        <ControlLabel>Choose Favorite Color</ControlLabel>
                                        <FormControl componentClass="select"
                                                     placeholder="Color here..."
                                                     value={this.state.color}
                                                     onChange={this.onChange('color')}
                                            >
                                            <option value="red">Red</option>
                                            <option value="green">Green</option>
                                            <option value="blue">Blue</option>
                                        </FormControl>
                                        <HelpBlock>use to identify you</HelpBlock>
                                    </FormGroup>
                                    <FormGroup>
                                        <ControlLabel>Favorite Movies </ControlLabel>
                                        <Checkbox value="harry potter"
                                                  checked={this.state.movies.indexOf('harry potter')>=0 ? true:false}
                                                  onChange={this.checkboxChange('movies')}>
                                            Harry Potter
                                        </Checkbox>
                                        <Checkbox value="lotr"
                                                  checked={this.state.movies.indexOf('lotr')>=0 ? true:false}
                                                  onChange={this.checkboxChange('movies')}>
                                            Lord of the Rings
                                        </Checkbox>
                                        <Checkbox value="twilight"
                                                  checked={this.state.movies.indexOf('twilight')>=0 ? true:false}
                                                  onChange={this.checkboxChange('movies')}>
                                            Twilight
                                        </Checkbox>
                                    </FormGroup>
                                    <FormGroup>
                                        <ControlLabel>Gender </ControlLabel>
                                        <Radio name="gender" value="male"
                                               onChange={this.onChange('gender')}>Male</Radio>
                                        <Radio name="gender" value="female"
                                               onChange={this.onChange('gender')}>Female</Radio>
                                    </FormGroup>
                                    <ButtonGroup>

                                        <Button bsStyle="primary" onClick={this.saveSurvey}>Save Survey</Button>

                                    </ButtonGroup>
                                </Form>
                            </Col>
                            <Col md={6}>
                                <Table condensed striped bordered hover>
                                    <thead>
                                    <tr>
                                        <th>Delete</th>
                                        <th>Edit</th>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Favorite Color</th>
                                        <th>Fav. Movie</th>
                                        <th>Gender</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {rows}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </Grid>

                </div>
                 <div className="modal-container" style={{height: 200}}>
        <Button
          bsStyle="primary"
          bsSize="large"
          onClick={() => this.setState({ show: true})}
        >
          Launch contained modal
        </Button>

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
                                    <FormGroup>
                                        <ControlLabel>Name please ...</ControlLabel>
                                        <FormControl
                                            type="text"
                                            placeholder="Name here..."
                                            value={this.state.name}
                                            onChange={this.onChange('name')}
                                            />
                                        <HelpBlock>use to identify you</HelpBlock>
                                    </FormGroup>
                                    <FormGroup>
                                        <ControlLabel>Choose Favorite Color</ControlLabel>
                                        <FormControl componentClass="select"
                                                     placeholder="Color here..."
                                                     value={this.state.color}
                                                     onChange={this.onChange('color')}
                                            >
                                            <option value="red">Red</option>
                                            <option value="green">Green</option>
                                            <option value="blue">Blue</option>
                                        </FormControl>
                                        <HelpBlock>use to identify you</HelpBlock>
                                    </FormGroup>
                                    <FormGroup>
                                        <ControlLabel>Favorite Movies </ControlLabel>
                                        <Checkbox value="harry potter"
                                                  checked={this.state.movies.indexOf('harry potter')>=0 ? true:false}
                                                  onChange={this.checkboxChange('movies')}>
                                            Harry Potter
                                        </Checkbox>
                                        <Checkbox value="lotr"
                                                  checked={this.state.movies.indexOf('lotr')>=0 ? true:false}
                                                  onChange={this.checkboxChange('movies')}>
                                            Lord of the Rings
                                        </Checkbox>
                                        <Checkbox value="twilight"
                                                  checked={this.state.movies.indexOf('twilight')>=0 ? true:false}
                                                  onChange={this.checkboxChange('movies')}>
                                            Twilight
                                        </Checkbox>
                                    </FormGroup>
                                    <FormGroup>
                                        <ControlLabel>Gender </ControlLabel>
                                        <Radio name="gender" value="male"
                                               onChange={this.onChange('gender')}>Male</Radio>
                                        <Radio name="gender" value="female"
                                               onChange={this.onChange('gender')}>Female</Radio>
                                    </FormGroup>
                                    <ButtonGroup>

                                        <Button bsStyle="primary" onClick={this.saveSurvey}>Save Survey</Button>

                                    </ButtonGroup>
                                </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
            </div>
        );
    }
}

export default App;
