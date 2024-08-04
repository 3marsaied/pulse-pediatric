import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:project_name/Pages/Patient/PatientPortal.dart';
import 'package:project_name/routes.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

String formatHour(String hour) {
  int h = int.parse(hour);
  String period = h >= 12 ? 'PM' : 'AM';
  h = h > 12 ? h - 12 : h;
  return '$h $period';
}

class AppointmentView extends StatefulWidget {
  final Map<String, dynamic> data;
  final bool isParent;
  final String? token;
  final VoidCallback? onDelete;
  

  AppointmentView({Key? key, required this.data, this.isParent = false, required this.token, this.onDelete}) : super(key: key);

  @override
  State<AppointmentView> createState() => _AppointmentViewState();
}

class _AppointmentViewState extends State<AppointmentView> {
  late int id = 0;

  @override
  void initState() {
    super.initState();
  }

  Future<void> _deleteAppointment() async {
    final url = Uri.parse(routes.deleteAppointment(widget.data['id'], widget.data['parentId']));
    print('Delete Appointment Data: ${widget.data['patientId']} ${widget.token!}');
    final headers = {
      'accept': 'application/json',
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

  Future<void> _confirmDeleteAppointment() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text('Confirm Deletion'),
          content: Text('Are you sure you want to delete this appointment?'),
          actions: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                TextButton(
                  onPressed: () {
                    Navigator.of(context).pop(false);
                  },
                  child: Text(
                    'Cancel',
                    style: TextStyle(fontSize: 18),
                  ),
                ),
                TextButton(
                  onPressed: () {
                    Navigator.of(context).pop(true);
                  },
                  child: Text(
                    'Delete',
                    style: TextStyle(fontSize: 18),
                  ),
                ),
              ],
            ),
          ],
        );
      },
    );

    if (confirmed == true) {
      await _deleteAppointment();
    }
  }

  @override
  Widget build(BuildContext context) {
    String capitalize(String s) => s[0].toUpperCase() + s.substring(1).toLowerCase();
    String capitalizeFirstLetters(String text) {
      return text.split(' ').map((word) => capitalize(word)).join(' ');
    }

    var parentName = capitalizeFirstLetters("${widget.data['parentFirstName']} ${widget.data['parentLastName']}");
    var doctorName = capitalizeFirstLetters("${widget.data['doctorFirstName']} ${widget.data['doctorLastName']}");

    var from = formatHour(widget.data['From']); // Format 'From' time to AM/PM
    var to = formatHour(widget.data['To']); // Format 'To' time to AM/PM

    // Convert date format from dd-MM-yyyy to yyyy-MM-dd
    String convertDateFormat(String date) {
      List<String> parts = date.split('-');
      return '${parts[2]}-${parts[1]}-${parts[0]}';
    }

    // Parse the appointment date and format it
    DateTime appointmentDate = DateTime.parse(convertDateFormat(widget.data['appointmentDate']));
    String formattedDate = DateFormat('EEE dd-MM-yyyy').format(appointmentDate);
    var date = '$formattedDate From: $from To: $to';

    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Column(
        children: [
          Container(
            decoration: BoxDecoration(
              color: Color.fromARGB(255, 255, 181, 97), // Adjust the color as needed
              borderRadius: BorderRadius.circular(12.0), // Adjust the radius as needed
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withOpacity(0.2),
                  spreadRadius: 2,
                  blurRadius: 5,
                  offset: Offset(0, 3), // changes position of shadow
                ),
              ],
            ),
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                children: [
                  Row(
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.start,
                        children: <Widget>[
                          if (widget.isParent == false) ...[
                            if (widget.data['parentPic'] != null)
                              Container(
                                width: 64,
                                height: 64,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  image: DecorationImage(
                                    image: NetworkImage(widget.data['parentPic']),
                                    fit: BoxFit.cover,
                                  ),
                                ),
                              )
                            else
                              Container(
                                width: 64,
                                height: 64,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  image: DecorationImage(
                                    image: AssetImage('assets/icon/profile.png'),
                                    fit: BoxFit.cover,
                                  ),
                                ),
                              ),
                          ] else ...[
                            if (widget.data['doctorPic'] != null)
                              Container(
                                width: 64,
                                height: 64,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  image: DecorationImage(
                                    image: NetworkImage(widget.data['doctorPic']),
                                    fit: BoxFit.cover,
                                  ),
                                ),
                              )
                            else
                              Container(
                                width: 64,
                                height: 64,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  image: DecorationImage(
                                    image: AssetImage('assets/icon/profile.png'),
                                    fit: BoxFit.cover,
                                  ),
                                ),
                              ),
                          ],
                        ],
                      ),
                      Padding(
                        padding: const EdgeInsets.fromLTRB(8.0, 0, 0, 0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.start,
                          children: [
                            if (widget.isParent == false) ...[
                              Row(
                                children: [
                                  Text(
                                    capitalizeFirstLetters("${widget.data['patientFirstName']}"),
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                    ),
                                  ),
                                  Text(
                                    ' ($parentName)',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 14,
                                    ),
                                  ),
                                ],
                              ),
                              Text(
                                date,
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 14,
                                ),
                              ),
                            ] else ...[
                              Row(
                                children: [
                                  Text('Dr.${doctorName}', 
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 18,
                                    ),
                                  ), 
                                  SizedBox(width: 80,), // Spacer to push buttons to the end
                                  widget.isParent == true
                                    ? IconButton(
                                        icon: Image(
                                          image: AssetImage('assets/icon/remove.png'),
                                          width: 24,
                                          height: 24,
                                        ),
                                        onPressed: () async {
                                          await _confirmDeleteAppointment();
                                        },
                                      )
                                    : Container(),
                                ],
                              ),
                              Row(
                                children: [
                                  Text(
                                    widget.data['patientFirstName'],
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                    ),
                                  ),
                                  Text(
                                    ' ($parentName)',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 14,
                                    ),
                                  ),
                                ],
                              ),
                              Text(
                                date,
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 14,
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          SizedBox(height: 7),
        ],
      ),
    );
  }
}
