import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import 'package:project_name/Pages/auth/StartingScreen.dart';
import 'package:project_name/Pages/features/AppointmentView.dart';
import 'package:project_name/routes.dart';
import 'package:shared_preferences/shared_preferences.dart';

class DoctorPortal extends StatefulWidget {
  final String? token;
  final int? doctorId;
  const DoctorPortal({super.key, required this.token, required this.doctorId});

  @override
  State<DoctorPortal> createState() => _DoctorPortalState();
}

class _DoctorPortalState extends State<DoctorPortal> {
  List<dynamic> Datas = [];
  late String? doctorName = '';
  late String? doctorPic = '';

  @override
  void initState() {
    super.initState();
    getDoctorInfo();
    getAppointment();
  }


  Future<void> getDoctorInfo() async{
    final url = Uri.parse(routes.doctorInfo(widget.doctorId!, widget.token!));
    final response = await http.get(url);
    if (response.statusCode == 200){
      final data = json.decode(response.body);
      String capitalize(String text) {
        return text.split(" ").map((str) => str[0].toUpperCase() + str.substring(1)).join(" ");
      }
      doctorName = 'DR. ${capitalize(data['firstName'])} ${capitalize(data['lastName'])}';
      doctorPic = data['profilePicture'];
      setState(() {
        doctorName = 'DR. ${capitalize(data['firstName'])} ${capitalize(data['lastName'])}';
        doctorPic = data['profilePicture'];
      });

    }
    else{
      print(response.statusCode);
      print('Error: Failed to get data from the server.');
    }
  }

  Future<void> getAppointment() async {
    final url = Uri.parse(routes.doctorAppointment(widget.doctorId!, widget.token!));
    final response = await http.get(url);
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
        title: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircleAvatar(
              radius: 16,
              backgroundImage: 
              doctorPic != null ? NetworkImage(doctorPic!) : null,
              child: doctorPic == null ? Image.asset('assets/icon/profile.png'): null,
              backgroundColor: Colors.transparent,              
            ),
            SizedBox(width: 10,),
            Text(
              doctorName!,
              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 20.0)
            ),
          ],
        ),
        centerTitle: true,
        actions: [
          Builder(
            builder: (context) => IconButton(
              icon: Container(
                width: 35,
                height: 35,
                child: Image(image: AssetImage('assets/icon/editProfile.png'))
                ),
              onPressed: (){
                Scaffold.of(context).openEndDrawer();
              },
            ),
          )
        ],
      ),
      floatingActionButton: Column(
        crossAxisAlignment: CrossAxisAlignment.end,
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          FloatingActionButton(
            onPressed: () async{
              //Get.to(() => const AppointmentView());
            },
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            child: Container(
              width: 30,
              height: 30,
              child: Image(
                image: AssetImage('assets/icon/editProfile.png',
                
              )),
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
              Get.off(() => const StartingScreen());
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
                    child: ListView.builder(
                      itemCount: Datas.length,
                      itemBuilder: (context, index) {
                        var Data = Datas[index];
                        print("Data: $Data");
                        return  AppointmentView(data:Data);
                      },
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