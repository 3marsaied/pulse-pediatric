import 'package:flutter/material.dart';

import 'package:project_name/Pages/Patient/Drawer/AddPatient.dart';
import 'package:project_name/Pages/Patient/Drawer/PatientData.dart';
import 'package:project_name/Pages/Patient/Drawer/EditUser.dart';
import 'package:project_name/routes.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class Enddrawer extends StatefulWidget {
  final String? userPic;
  final String user_name;
  final int parentId;
  final String? userName;
  final String? email;
  final int? age;
  final String? firstName;
  final String? lastName;
  final String? phone;
  final String? token;
  const Enddrawer({super.key, required this.userPic, required this.user_name, required this.parentId, required this.token,  this.userName, this.email, this.age, this.firstName, this.lastName, this.phone});

  @override
  State<Enddrawer> createState() => _EnddrawerState();
}



class _EnddrawerState extends State<Enddrawer> {
  late var Datas = []; 
  late int parentId = widget.parentId;
  late int patientId = 0;
  
  

  @override
  void initState() {
    super.initState();
  String capitalize(String text) {
    return text.split(" ").map((str) => str[0].toUpperCase() + str.substring(1)).join(" ");}
    getPatient();
  }
  

  

  Future<void> getPatient() async {
    final url = Uri.parse(routes.yourPatients(widget.parentId));
    print("++ ${widget.parentId} ++");
    final headers = {
      'accept': 'application/json',
      'Authorization': 'Bearer ${widget.token!}',
    };

    final response = await http.get(url, headers: headers);
  
      print("get Patient response status: " + response.statusCode.toString());
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          Datas = data;
          
        });
        print('Parient Data: $Datas');
      }
      else {
        print("get Patient response status: " + response.statusCode.toString());
      }
  }



  @override
  Widget build(BuildContext context) {
    print('use pic :${widget.userPic}');
    print('user Name: ${widget.user_name}');
    return Container(
      width: MediaQuery.of(context).size.width ,
      height: double.infinity,
      color: Colors.transparent,
      child: Padding(
        padding: const EdgeInsets.all(10.0),
        child: SafeArea(
          child: ListView(
            shrinkWrap: true,
            physics: NeverScrollableScrollPhysics(),
            children: [
              Column(
                children: [
                  SizedBox(height: 10,),
                  CircleAvatar(
                    radius: 84,
                    backgroundImage: widget.userPic != null ? NetworkImage(widget.userPic!) : null,
                    child: widget.userPic == null ? Image.asset('assets/icon/profile.png') : null,
                    backgroundColor: Colors.transparent,
                  ),
                  SizedBox(height: 10,),
                  Text(
                    widget.user_name,
                    style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 32),
                  ),
                ],
              ),
              SizedBox(height: 20,),
              Container(
                child: Center(
                  child: Row(
                    children: [
                      Text(
                        'Your Children',
                        style: TextStyle(color: Colors.black, fontSize: 24, fontWeight: FontWeight.bold),
                      ),
                      Spacer(),
                      Container(
                        decoration: BoxDecoration(
                          color: Color.fromARGB(255, 255, 181, 97),
                          borderRadius: BorderRadius.circular(12.0), // Adjust the radius to your preference
                        ),
                        child: IconButton(
                          icon: Icon(
                            Icons.add,
                            color: Colors.black,
                            size: 32,
                          ), onPressed: () { 
                            Navigator.pop(context);
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => AddPatient(
                              parentId: parentId,
                              token: widget.token,
                            )));
                           },
                        ),
                      ),
                    ],
                  ),  
                ),
              ),
              SizedBox(height: 10,),
              ListView.builder(
                shrinkWrap: true,
                physics: NeverScrollableScrollPhysics(),
                itemCount: Datas.length,
                itemBuilder: (context, index) {
                  var Data = Datas[index];
                  return PatientView(data: Data,parentId: widget.parentId,token: widget.token, onDelete: () {
                                    setState(() {}); // Reload the widget after deletion
                                  },);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
