import 'package:flutter/material.dart';
import 'package:project_name/Pages/Patient/PatientPortal.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:project_name/routes.dart';

class AddAppointment extends StatefulWidget {
  final String? token;
  final int? parentId;
  const AddAppointment({super.key, required this.token, required this.parentId});

  @override
  State<AddAppointment> createState() => _AddAppointmentState();
}

class _AddAppointmentState extends State<AddAppointment> {
  late List<dynamic> patientList = [];
  late List<dynamic> doctorList = [];
  late List<dynamic> appointmentList = [];
  int? selectedPatientId;
  int? selectedDoctorId;
  String? selectedPatientName;
  String? selectedDoctorName;
  String? appointmentDate;
  int? from;
  late String FromAm = 'AM';
  late String ToAm = 'AM';
  late bool isSelected = false;

  final List<String> weekDays = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'
  ];

  final List<String> timeSlots = [
    '9', '10', '11', '12', '13', '14', '15', '16', '17'
  ];

  @override
  void initState() {
    super.initState();
    getPatient();
    _doctorList();
    getAllAppointments();
  }

  Future<void> getPatient() async {
    final url = Uri.parse(routes.yourPatients(widget.parentId!));
    final headers = {
      'accept': 'application/json',
      'Authorization': 'Bearer ${widget.token!}',
    };

    final response = await http.get(url, headers: headers);
    print("get Patient response status: " + response.statusCode.toString());
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      setState(() {
        patientList = data;
      });
    } else {
      print("get Patient response status: " + response.statusCode.toString());
    }
  }

  Future<void> getAllAppointments() async {
    final url = Uri.parse(routes.getAllAppointments);
    final response = await http.get(url);

    print("get All Appointments response status: " + response.statusCode.toString());
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      setState(() {
        appointmentList = data;
      });
    } else {
      print("get All Appointments response status: " + response.statusCode.toString());
    }
  }

  Future<void> _doctorList() async {
    final url = Uri.parse(routes.doctorList);
    final response = await http.get(url);

    print("get Doctor response status: " + response.statusCode.toString());
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      doctorList = data;
      setState(() {
      });
    } else {
      print("get Doctor response status: " + response.statusCode.toString());
    }
  }

  Future<void> addAppointment() async {
    final url = Uri.parse(routes.addAppointments);
    final headers = {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${widget.token!}',
    };

    final response = await http.get(url, headers: headers);
    print('add appointments data: ${widget.parentId} $selectedDoctorId $selectedPatientId $appointmentDate $from ${from!+1}');
    final body = jsonEncode({
      'parentId': widget.parentId!,
      'doctorId': selectedDoctorId!,
      "patientId": selectedPatientId!,
      "appointmentDate": appointmentDate!,
      "From": "$from",
      "To": "${from! + 1}",
      "isTaken": true
    });

    await http.post(url, headers: headers, body: body);
  }

  Future<void> _confirmAddAppointment() async {
    // Helper function to show a dialog
    Future<bool?> _showConfirmationDialog(String title, String content, bool isTrue) {
      
      return showDialog<bool>(
        context: context,
        builder: (context) {
          return AlertDialog(
            title: Text(title),
            content: Text(content),
            actions: [
              isTrue
              ?Row(
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
                      'Confirm',
                      style: TextStyle(fontSize: 18),
                    ),
                  ),
                ],
              )
              :TextButton(
                onPressed: () {
                  Navigator.of(context).pop(false);
                },
                child: Text(
                  'Cancel',
                  style: TextStyle(fontSize: 18),
                ),
              )
            ],
          );
        },
      );
    }

    // Check if the selected patient is missing
    if (selectedPatientId == null || selectedPatientId == 0) {
      bool? patientSelected = await _showConfirmationDialog(
        'Select Patient',
        'Please select a patient first.',
        false,
      );
      if (patientSelected == false) return;
    }


    // Check if the selected doctor is missing
    if (selectedDoctorId == null || selectedDoctorId == 0) {
      bool? doctorSelected = await _showConfirmationDialog(
        'Select Doctor',
        'Please select a doctor first.',
        false,
      );
      if (doctorSelected == false) return;
    }


    // Check if the appointment date and time are missing
    if (appointmentDate == null || from == null) {
      bool? appointmentSelected = await _showConfirmationDialog(
        'Select Appointment',
        'Please select a day and time for the appointment.',
        false,
      );
      if (appointmentSelected == false) return;
    }

    // If all fields are provided, confirm addition of the appointment
    bool? confirmed = await _showConfirmationDialog(
      'Confirm Addition',
      'Are you sure you want to add this appointment?',
      true,
    );

    if (confirmed == true) {
      await addAppointment();
      // Navigate back to PatientPortal
      setState(() {
        Navigator.pop(context);
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => PatientPortal(
            token: widget.token,
            userId: widget.parentId,
          ),
        ),
      );
      });
    }
  }

  void _showSelectionBottomSheet(
      BuildContext context, List<dynamic> items, Function(int, String) onSelected, String title) {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return Container(
          height: 400,
          color: Colors.grey[200], // Change the background color here
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Text(title, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              ),
              Expanded(
                child: ListView.builder(
                  itemCount: items.length,
                  itemBuilder: (BuildContext context, int index) {
                    final item = items[index];
                    final fullName = title == "Choose Patient"
                        ? '${item['firstName']} ${item['lastName']}'
                        : '${item['title']}';
                    return ListTile(
                      leading: title == "Choose Doctor"
                          ? CircleAvatar(
                              radius: 16,
                              backgroundImage: NetworkImage(item['thumbnail']),
                              backgroundColor: Colors.transparent,
                            )
                          : null,
                      title: Text(fullName, style: TextStyle(color: Colors.black)), // Change text color here
                      tileColor: Colors.white, // Change tile background color here
                      selectedTileColor: Colors.blue[100], // Change selected tile color here
                      onTap: () {
                        onSelected(item['id'], fullName);
                        Navigator.pop(context);
                      },
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  bool isSlotTaken(String day, String time) {
    print("some data: $day $time $selectedDoctorId ");
    if (selectedDoctorId == null) return false;

    for (var appointment in appointmentList) {
      if (appointment['doctorId'] == selectedDoctorId &&
          appointment['appointmentDate'] == day &&
          appointment['From'] == time && // Removed curly braces and ensure same type comparison
          appointment['isTaken'] == true) {
        return true;
      }
    }
    return false;
  }


  @override
Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(
      backgroundColor: Colors.black,
      leading: IconButton(
        icon: Icon(
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
                userId: widget.parentId,
              ),
            ),
          );
        },
      ),
      title: const Text(
        'Add Appointment',
        style: TextStyle(
          color: Colors.white,
          fontSize: 20.0,
          fontWeight: FontWeight.bold,
        ),
      ),
      centerTitle: true,
      actions: <Widget>[
        ElevatedButton(
          style: ElevatedButton.styleFrom(
            foregroundColor: Color.fromARGB(216, 255, 158, 47),
            backgroundColor: Color.fromARGB(255, 255, 181, 97),
          ),
          child: Text(
            "Save",
            style: TextStyle(
              color: Colors.white,
            ),
          ),
          onPressed: () async {
            await _confirmAddAppointment();
          },
        ),
      ],
    ),
    body: Padding(
      padding: const EdgeInsets.all(16.0),
      child: ListView(
        shrinkWrap: true,
        children: [
          Column(
            children: [
              SizedBox(height: 10),
              Center(
                child: Text(
                  'Choose Patient:',
                  style: TextStyle(
                    color: Colors.black,
                    fontWeight: FontWeight.bold,
                    fontSize: 22,
                  ),
                ),
              ),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Color.fromARGB(216, 255, 158, 47), // Background color
                  foregroundColor: Colors.white, // Text color
                  padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                onPressed: () => _showSelectionBottomSheet(
                  context,
                  patientList,
                  (id, name) => setState(() {
                    selectedPatientId = id;
                    selectedPatientName = name;
                  }),
                  'Choose Patient',
                ),
                child: Text(
                  selectedPatientName != null ? selectedPatientName! : 'Select Patient',
                  style: TextStyle(fontSize: 16),
                ),
              ),
            ],
          ),
          Divider(
            color: Color.fromARGB(255, 211, 210, 210),
            thickness: 2,
          ),
          Column(
            children: [
              SizedBox(height: 10),
              Center(
                child: Text(
                  'Choose Doctor:',
                  style: TextStyle(
                    color: Colors.black,
                    fontWeight: FontWeight.bold,
                    fontSize: 22,
                  ),
                ),
              ),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Color.fromARGB(216, 255, 158, 47), // Background color
                  foregroundColor: Colors.white, // Text color
                  padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                onPressed: () => _showSelectionBottomSheet(
                  context,
                  doctorList,
                  (id, name) => setState(() {
                    selectedDoctorId = id;
                    selectedDoctorName = name;
                  }),
                  'Choose Doctor',
                ),
                child: Text(
                  selectedDoctorName != null ? selectedDoctorName! : 'Select Doctor',
                  style: TextStyle(fontSize: 16),
                ),
              ),
            ],
          ),
          Divider(
            color: Color.fromARGB(255, 211, 210, 210),
            thickness: 2,
          ),
          Column(
            children: [
              SizedBox(height: 10),
              Center(
                child: Text(
                  'Choose Appointment Slot:',
                  style: TextStyle(
                    color: Colors.black,
                    fontWeight: FontWeight.bold,
                    fontSize: 22,
                  ),
                ),
              ),
              SizedBox(height: 10),
              Center(
                child: Text('You want to add Appointment at ${appointmentDate ?? "(not selected yet)"} from ${from ?? "(not selected yet)"} to ${from != null ? from! + 1 : "(not selected yet)"}')
              ),
              SizedBox(height: 10),
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Table(
                  border: TableBorder.all(color: Colors.black),
                  defaultColumnWidth: FixedColumnWidth(100.0), // Adjust column width as needed
                  children: [
                    TableRow(
                      children: [
                        TableCell(child: Center(child: Text('Time'))),
                        ...weekDays.map((day) => TableCell(child: Center(child: Text(day)))).toList(),
                      ],
                    ),
                    ...timeSlots.map((time) {
                      return TableRow(
                        children: [
                          TableCell(child: Center(child: Text(time))),
                          ...weekDays.map((day) {
                            bool taken = isSlotTaken(day, time);
                            return TableCell(
                              child: Center(
                                child: taken
                                    ? Column(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      crossAxisAlignment: CrossAxisAlignment.center,
                                      children:[ 
                                        Container(
                                          height: 48,
                                        color: Colors.red,
                                        child: Align(
                                          alignment: Alignment.center,
                                          child: Text(
                                              'Taken',
                                              style: TextStyle(color: Colors.white, fontSize: 18),
                                            ),
                                        ),
                                      ),]
                                    )
                                    : Container(
                                      width: double.infinity,
                                      color: Color.fromARGB(216, 255, 158, 47),
                                      child: ElevatedButton(
                                          style: ElevatedButton.styleFrom(
                                            backgroundColor: Color.fromARGB(216, 255, 158, 47),
                                            foregroundColor: Colors.white,
                                            padding: EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                                            shape: RoundedRectangleBorder(
                                              borderRadius: BorderRadius.circular(6),
                                            ),
                                          ),
                                          onPressed: () {
                                            setState(() {
                                              appointmentDate = day;
                                              from = int.parse(time);
                                            });
                                          },
                                          child: Text(
                                            '',
                                          ),
                                        ),
                                    ),
                              ),
                            );
                          }).toList(),
                        ],
                      );
                    }).toList(),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    ),
  );
}
}
