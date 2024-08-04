import 'dart:convert';
import 'package:flutter/cupertino.dart';
import 'package:flutter/widgets.dart';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:project_name/Pages/Patient/AddAppointment.dart';
import 'package:project_name/Pages/Patient/Drawer/EditPatient.dart';
import 'package:project_name/Pages/Patient/PatientPortal.dart';
import 'package:project_name/Pages/auth/StartingScreen.dart';
import 'package:project_name/Pages/features/AppointmentView.dart';
import 'package:project_name/routes.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ChildAppointment extends StatefulWidget {
  final String? token;
  final int? userId;
  final String? childName;
  final int? childId;

  const ChildAppointment({
    super.key,
    required this.token,
    required this.userId,
    required this.childName,
    required this.childId,
  });

  @override
  State<ChildAppointment> createState() => _ChildAppointmentState();
}

class _ChildAppointmentState extends State<ChildAppointment> {
  late String? firstName = '';
  late String? lastName = '';
  late int? age = 0;
  late String? gender = '';
  bool isLoading = true;
  List<dynamic> Datas = [];

  @override
  void initState() {
    super.initState();
    getChildData();
    getAppointment();
  }

  Future<void> getChildData() async {
    final url = Uri.parse(routes.getChild(widget.userId!, widget.childId!));
    final headers = {
      'accept': 'application/json',
      'Authorization': 'Bearer ${widget.token!}',
    };

    try {
      final response = await http.get(url, headers: headers);
      print("response status childAppointment: " + response.statusCode.toString());
      if (response.statusCode == 200) {
        Map<String, dynamic> data = jsonDecode(response.body);
        setState(() {
          String capitalize(String text) {
            return text.split(" ").map((str) => str[0].toUpperCase() + str.substring(1)).join(" ");
          }

          firstName = data['firstName'];
          lastName = data['lastName'];
          age = data['age'];
          gender = data['gender'];
        });
      } else {
        print('Request failed with status: ${response.statusCode}.');
      }
    } catch (e) {
      print('Exception occurred: $e');
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  Future<void> getAppointment() async {
    final url = Uri.parse(routes.childAppointment(widget.userId!, widget.childId!));
    final headers = {
      'accept': 'application/json',
      'Authorization': 'Bearer ${widget.token!}',
    };

    try {
      final response = await http.get(url, headers: headers);
      print("response childAppointment: ${response.statusCode}");
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          Datas = data;
        });
        print("response status childAppointment: $data");
      } else {
        print(response.statusCode);
        print('Error: Failed to get data from the server.');
      }
    } catch (e) {
      print('Exception occurred: $e');
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  void handleDelete(int appointmentId) {
    setState(() {
      Datas.removeWhere((appointment) => appointment['id'] == appointmentId);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.black,
        leading: IconButton(
          icon: const Icon(
            Icons.arrow_back,
            color: Colors.white,
          ),
          onPressed: () {
            Navigator.pop(context);
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => PatientPortal(
                  token: widget.token,
                  userId: widget.userId,
                ),
              ),
            );
          },
        ),
        title: Align(
          alignment: Alignment.center,
          child: Text(
            widget.childName ?? '',
            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
          ),
        ),
        leadingWidth: 30,
      ),
      floatingActionButton: Column(
        crossAxisAlignment: CrossAxisAlignment.end,
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          FloatingActionButton(
            onPressed: () async {
              Navigator.pop(context);
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => EditPatient(
                    token: widget.token,
                    firstName: firstName,
                    lastName: lastName,
                    age: age,
                    parentId: widget.userId!,
                    patientId: widget.childId!,
                    gender: gender,
                    childName: widget.childName,
                  ),
                ),
              );
            },
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            child: Container(
              width: 30,
              height: 30,
              child: const Image(
                image: AssetImage('assets/icon/editProfile.png'),
              ),
            ),
            backgroundColor: const Color(0xFFFFB561),
          ),
          const SizedBox(height: 10),
          FloatingActionButton(
            onPressed: () async {
              final SharedPreferences prefs = await SharedPreferences.getInstance();
              await prefs.remove('accessToken');
              await prefs.remove('role');
              await prefs.remove('userId');
              Navigator.pop(context);
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const StartingScreen()),
              );
            },
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            child: Container(
              width: 30,
              height: 30,
              child: const Image(
                image: AssetImage('assets/icon/out.png'),
              ),
            ),
            backgroundColor: const Color(0xFFFFB561),
          ),
        ],
      ),
      body: Container(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Row(
                children: [
                  const Text(
                    'Appointments',
                    style: const TextStyle(color: Colors.black, fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  const Spacer(),
                  Container(
                    decoration: BoxDecoration(
                      color: const Color.fromARGB(255, 255, 181, 97),
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                    child: IconButton(
                      icon: const Icon(
                        Icons.add,
                        color: Colors.black,
                        size: 32,
                      ),
                      onPressed: () {
                        showModalBottomSheet(
                          context: context,
                          builder: (BuildContext context) {
                            return SizedBox(
                              height: 300,
                              child: AddAppointment(
                                parentId: widget.userId,
                                token: widget.token,
                                childId: widget.childId, childName: widget.childName,
                              ),
                            );
                          },
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
            Expanded( // Use Expanded to allow ListView to take remaining space
              child: isLoading
              ?const Center(child: CircularProgressIndicator())
              :ListView.builder(
                itemCount: Datas.length,
                itemBuilder: (context, index) {
                  var Data = Datas[index];
                  print("Data: $Data");
                  return AppointmentView(
                    data: Data,
                    token: widget.token,
                    isParent: true,
                    onDelete: () {
                      handleDelete(Data['id']);
                    },
                  );
                },
              )
            ),
          ],
        ),
      ),
    );
  }
}
