import 'package:flutter/material.dart';
import 'package:project_name/Pages/Patient/Child/childAppointment.dart';

import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:project_name/Pages/Patient/PatientPortal.dart';
import 'package:project_name/routes.dart';

class PatientView extends StatefulWidget {
  final Map<String, dynamic> data;
  final String? token;
  final int? parentId;
  final VoidCallback? onDelete;

  const PatientView({
    super.key,
    required this.data,
    required this.parentId,
    required this.token,
    this.onDelete,
  });

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

  String capitalize(String text) {
    if (text.isEmpty) return text;
    return text[0].toUpperCase() + text.substring(1).toLowerCase();
  }

  @override
  Widget build(BuildContext context) {
    String firstName = capitalize(data['firstName']);
    String lastName = capitalize(data['lastName']);

    return GestureDetector(
      onTap: () {
        Navigator.pop(context);
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ChildAppointment(
              token: widget.token!,
              userId: widget.parentId!,
              childName: "$firstName $lastName", childId: patientId,
            ),
          ),
        );
      },
      child: Column(
        children: [
          Container(
            decoration: BoxDecoration(
              color: Color.fromARGB(255, 255, 181, 97),
              borderRadius: BorderRadius.circular(12.0), // Adjust the radius to your preference
            ),
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
                        '$firstName $lastName',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.black,
                        ),
                      ),
                      SizedBox(
                        height: 10,
                      ),
                      Spacer(),
                      IconButton(
                        icon: Image(
                          image: AssetImage('assets/icon/arrow-right.png'),
                          width: 24,
                          height: 24,
                        ),
                        onPressed: () async {
                          Navigator.pop(context);
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => ChildAppointment(
                                token: widget.token!,
                                userId: widget.parentId!,
                                childName: "$firstName $lastName", childId: patientId,
                              ),
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          SizedBox(
            height: 15,
          ),
        ],
      ),
    );
  }
}
