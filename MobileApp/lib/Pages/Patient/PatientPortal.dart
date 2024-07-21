import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:project_name/Pages/Patient/AddAppointment.dart';
import 'package:project_name/Pages/Patient/Drawer/Drawer.dart';
import 'package:project_name/Pages/auth/StartingScreen.dart';
import 'package:project_name/Pages/features/AppointmentView.dart';
import 'package:project_name/routes.dart';
import 'package:shared_preferences/shared_preferences.dart';

class PatientPortal extends StatefulWidget {
  final String? token;
  final int? userId;
  const PatientPortal({super.key, required this.token, required this.userId});

  @override
  State<PatientPortal> createState() => _PatientPortalState();
}

class _PatientPortalState extends State<PatientPortal> {
  late String? user_name = '';
  late String? userName = '';
  late String? userEmail = '';
  late String? userPhone = '';
  late String? userPic = '';
  late int userId = 0;
  late String? firstName = '';
  late String? lastName = '';
  late int? age = 0;
  List<dynamic> Datas = [];

  @override
  void initState() {
    super.initState();
    getUserData();
    setState(() {
      getAppointment();
    });
  }

  Future<void> getUserData() async {
    final url = Uri.parse(routes.getUser(widget.userId!));
    final headers = {
      'accept': 'application/json',
      'Authorization': 'Bearer ${widget.token!}',
    };

    try {
      final response = await http.get(url, headers: headers);
      print("response status: " + response.statusCode.toString());
      if (response.statusCode == 200) {
        // If the server returns a 200 OK response, parse the JSON.
        Map<String, dynamic> data = jsonDecode(response.body);
        setState(() {
          String capitalize(String text) {
            return text.split(" ").map((str) => str[0].toUpperCase() + str.substring(1)).join(" ");
          }
        user_name = "Mr.${capitalize(data['firstName'])} ${capitalize(data['lastName'])}";
        userId = data['userId'];
        userName = data['userName'];
        userEmail = data['email'];
        firstName = data['firstName'];
        lastName = data['lastName'];
        userPhone = data['phone'];
        age = data['age'];
        userPic = data['profilePicture'];
        print('passed data is: $userId $userName $userEmail $firstName $lastName $userPhone $age $userPic');
        });
      } else {
        // If the server did not return a 200 OK response, throw an exception.
        print('Request failed with status: ${response.statusCode}.');
      }
    } catch (e) {
      // Catch any exceptions thrown during the request and print them.
      print('Exception occurred: $e');
    }
  }

  Future<void> getAppointment() async {
    final url = Uri.parse(routes.getPaitenAppointment(widget.userId!));
    final headers = {
      'accept': 'application/json',
      'Authorization': 'Bearer ${widget.token!}',
    };

    final response = await http.get(url, headers: headers);
    if (response.statusCode == 200){
      final data = json.decode(response.body);
      Datas = data;
    }
    else{
      print(response.statusCode);
      print('Error: Failed to get data from the server.');
    }
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.black,
        automaticallyImplyLeading: false,
        leading: Padding(
          padding: const EdgeInsets.only(left: 10),
          child: Builder(
            builder: (context) => IconButton(
              icon: const Icon(Icons.menu, color: Colors.white,),
              onPressed: () {
                Scaffold.of(context).openDrawer();
              },
            ),
          ),
        ),
        title: Padding(
          padding: const EdgeInsets.only(right: 60),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircleAvatar(
                radius: 16,
                backgroundImage: 
                userPic != null ? NetworkImage(userPic!) : null,
                child: userPic == null ? Image.asset('assets/icon/profile.png'): null,
                backgroundColor: Colors.transparent,              
              ),
              SizedBox(width: 10,),
              Text(
                user_name!,
                style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 20.0)
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: Column(
        crossAxisAlignment: CrossAxisAlignment.end,
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          FloatingActionButton(
            onPressed: () async{
              Navigator.pop(context);
              Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) =>  AddAppointment(
                      token: widget.token,
                      parentId: userId,
                      )));
            },
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            child: Container(
              width: 30,
              height: 30,
              child: Icon(Icons.add, color: Colors.black, size: 32,)
            ),
            backgroundColor: Color.fromARGB(255, 255, 181, 97),
          ),
          SizedBox(height: 10,),
          FloatingActionButton(
            onPressed: () async{
              final SharedPreferences prefs =await SharedPreferences.getInstance();
              await prefs.remove('accessToken');
              await prefs.remove('role');
              await prefs.remove('userId');
              Navigator.pop(context);
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => const StartingScreen()));
            },
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            child: Container(
              width: 30,
              height: 30,
              child: Image(
                image: AssetImage('assets/icon/out.png',
                
              )),
            ),
            backgroundColor: Color.fromARGB(255, 255, 181, 97),
          ),
        ],
      ),      
      drawer: Enddrawer(
        userPic: userPic, 
        user_name: user_name!,
        parentId: userId, 
        token: widget.token,
        userName: userName!,
        email: userEmail,
        phone: userPhone,
        firstName: firstName,
        lastName: lastName,
        age: age,
        ),      
      body:Container(
        child:  FutureBuilder<void>(
          future: getAppointment(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(
                child: CircularProgressIndicator(),
              );
            } else if (snapshot.hasError) {
              return Center(
                child: Text('Error: ${snapshot.error}'),
               );
            }
            else{
              return Column(
                children: [
                  SizedBox(height: 10,),
                  Text(
                    'Your Appointments',
                    style: TextStyle(
                      color: Colors.black,
                      fontWeight: FontWeight.bold,
                      fontSize: 22.0,
                    ),
                    ),
                    SizedBox(height: 10,), // Add your text here
                  Expanded(
                    child: Column(
                      children: [
                        Expanded(
                          child: ListView.builder(
                            itemCount: Datas.length + 1,
                            itemBuilder: (context, index) {
                              if (index == Datas.length) {
                                return Container(
                                  width: double.infinity, 
                                  height: 150,
                                );
                              } else {
                                var Data = Datas[index];
                                return AppointmentView(data: Data, token: widget.token, isParent: true, onDelete: () {
                                    setState(() {}); // Reload the widget after deletion
                                  },);
                              }
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              );
            }
          }
        )
      )
    );
  }
}