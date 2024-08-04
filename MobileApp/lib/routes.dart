
class routes {
  static const String baseUrl = 'https://pediatric-pulse.onrender.com';
  static const String login = '$baseUrl/login';
  static const String register = '$baseUrl/signup';
  static String getUser(int userId) => '$baseUrl/get/user/$userId';
  static String getChild(int userId, int childId) => '$baseUrl/get/patient/$childId/$userId';
  static String doctorAppointment(int doctorId) => '$baseUrl/get/doctor/appointments/table/$doctorId/$doctorId';
  static String doctorInfo(int doctorId) => '$baseUrl/get/doctor/$doctorId';
  static String updateDoctor(int doctorId) => '$baseUrl/update/doctor/$doctorId';
  static String updateUser(int userId) => '$baseUrl/update/user/$userId';
  static String getPaitenAppointment(int pid) => '$baseUrl/get/appointment/$pid';
  static String deleteAppointment(int appointmentId, int adminId, ) => '$baseUrl/delete/appointment/$appointmentId/$adminId';
  static String yourPatients(int parentId) => '$baseUrl/get/patients/$parentId';
  static String updatePatient(int patientId, int parentId) => '$baseUrl/update/patient/$patientId/$parentId';
  static String addPatient = '$baseUrl/add/patient';
  static const String doctorList = '$baseUrl/doctorList';
  static const String getAllAppointments = '$baseUrl/get/all/appointments';
  static String addAppointments = '$baseUrl/add/appointment';
  static String deletePatient(int parentId, int patientId) => '$baseUrl/delete/patient/$patientId/$parentId';
  static String addFcmToken = '$baseUrl/add/fcmToken';
  static String childAppointment(int userId, int childId)=>'$baseUrl/get/appointment/$userId/$childId';
}



