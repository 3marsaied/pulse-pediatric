import 'package:flutter/material.dart';
import 'package:project_name/Pages/Patient/Drawer/EditPatient.dart';
import 'package:project_name/Pages/Patient/Drawer/EditPatient.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:project_name/Pages/Patient/PatientPortal.dart';
import 'package:project_name/routes.dart';


class PatientView extends StatefulWidget {
  final Map<String, dynamic> data;
  final String? token;
  final int? parentId;
  final VoidCallback? onDelete;
  const PatientView({super.key, required this.data, required this.parentId, required this.token, this.onDelete});

  @override
  State<PatientView> createState() => _PatientViewState();
}

class _PatientViewState extends State<PatientView> {
  late var data = widget.data;
  late var patientId = data['id'];


  @override
  void initState() {
    super.initState();
  
  }

  Future<void> _deletePatient() async {
    final url = Uri.parse(routes.deletePatient(widget.parentId!, patientId));
    final headers = {
      'Authorization': 'Bearer ${widget.token!}',
    };

    final response = await http.delete(url, headers: headers);
    print("response status: " + response.statusCode.toString());
    if (response.statusCode == 200) {
      print('Appointment Deleted Successfully');
      if (widget.onDelete != null) {
        widget.onDelete!(); // Trigger the callback
      }
    } else {
      print('Request failed with status: ${response.statusCode}.');
    }
  }

  @override
  Widget build(BuildContext context) {
    print("Data is 2222: ${widget.data}");
    String capitalize(String text) {
    return text.split(" ").map((str) => str[0].toUpperCase() + str.substring(1)).join(" ");}
    return Container(
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              children: [
                SizedBox(
                  height: 10,
                ),
                Text(
                  capitalize(data['firstName']) + ' ' + capitalize(data['lastName']),
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.white
                  ),
                ),
                SizedBox(
                  height: 10,
                ),
                Spacer(),
                IconButton(
                  icon: Image(
                    image: AssetImage('assets/icon/image.png'),
                    width: 24,
                    height: 24,
                  ),
                  onPressed: () async {
                    Navigator.pop(context);
               
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => EditPatient(
                      parentId: data['parentId'],
                      patientId: data['id'],
                      token: widget.token,
                      firstName: data['firstName'],
                      lastName: data['lastName'],
                      gender: data['gender'],
                      age: data['age'],
                    )));
                  },
                ),
                 IconButton(
                  icon: Image(
                    image: AssetImage('assets/icon/remove.png'),
                    width: 24,
                    height: 24,
                    ), onPressed: () async{ await _deletePatient();
                    Navigator.pop(context);
                    Navigator.push(context, MaterialPageRoute(builder: (context) => PatientPortal(token: widget.token, userId: widget.parentId)));
                    },
                  ),
                
              ],
            ),
          ),
          Divider(
            color: Color.fromARGB(255, 46, 46, 46),
            thickness: 1,
          )
        ],
      ),
    );
  }
}