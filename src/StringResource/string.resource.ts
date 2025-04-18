export class StringResource {
  /// Queue Name
  static readonly QUEUE_NAME = {
    REGISTER_QUEUE: 'register-verification',
    RESEND_CODE_OTP_QUEUE: 'resend-otp-verification',
  };

  /// Message Trigger function
  static readonly SUCCESS_MESSAGES_TRIGGER_FUNCTION = {
    //authentication
    SUCCESS_TRIGGER_FUNCTION_REGISTER_SERVICE:
      'function register service di trigger',
    SUCCESS_TRIGGER_FUNCTION_LOGIN_SERVICE: 'function login service di trigger',
    SUCCESS_TRIGGER_FUNCTION_VERIFICATION_SERVICE:
      'function login service di trigger',
    SUCCESS_TRIGGER_FUNCTION_RESEND_VERIFICATION_SERVICE:
      'function login service di trigger',
    SUCCESS_TRIGGER_FUNCTION_UPDATE_NAME_USER_SERVICE:
      'function update name user service di trigger',
    SUCCESS_TRIGGER_FUNCTION_UPDATE_NO_HANDPHONE_USER_SERVICE:
      'function update no handphone user service di trigger',
    SUCCESS_TRIGGER_FUNCTION_UPDATE_ADDRESS_USER_SERVICE:
      'function update address user service di trigger',
  };

  ///Error Message Validate
  static readonly ERROR_MESSAGES_VALIDATE = {
    NAME_REQUIRED: 'Nama tidak boleh kosong',
    NAME_MIN_LENGTH: 'Nama minimal 5 Karakter',
    NAME_MAX_LENGTH: 'Nama maksimal 50 karakter',

    NAME_TRASH_REQUIRED: 'Nama sampah tidak boleh kosong',
    NAME_TRASH_MIN_LENGTH: 'Nama sampah minimal 5 Karakter',
    NAME_TRASH_MAX_LENGTH: 'Nama sampah maksimal 255 karakter',

    EMAIL_REQUIRED: 'Email tidak boleh kosong',
    EMAIL_FORMAT: 'Format email tidak sesuai',

    ADDRESS_MIN_LENGTH: 'Alamat minimal 10 Karakter',
    ADDRESS_MAX_LENGTH: 'Alamat maksimal 255 Karakter',

    PHONE_REQUIRED: 'No handphone tidak boleh kosong',
    PHONE_FORMAT: 'Nomor handphone harus dimulai dengan 08',
    PHONE_MIN_LENGTH: 'Nomor handphone terlalu pendek, minimal 10 digit',
    PHONE_MAX_LENGTH: 'Nomor handphone terlalu panjang, maksimal 15 digit',

    PASSWORD_REQUIRED: 'Password tidak boleh kosong',
    OLD_PASSWORD_REQUIRED: 'Password lama tidak boleh kosong',
    NEW_PASSWORD_REQUIRED: 'Password baru tidak boleh kosong',
    PASSWORD_MIN_LENGTH: 'Password minimal 8 karakter',
    PASSWORD_LETTERS: 'Password harus mengandung huruf',
    PASSWORD_NUMBERS: 'Password harus mengandung angka',
    PASSWORD_SPECIAL_CHARACTERS: 'Password harus mengandung karakter khusus',

    CODE_OTP_REQUIRED: 'Code otp tidak boleh kosong',
    CODE_OTP_LENGTH: 'OTP harus terdiri dari 6 angka',
    CODE_OTP_FORMAT: 'OTP harus terdiri dari 6 angka',
    CODE_OTP_INTEGER: 'OTP harus terdiri dari 6 angka',

    ACCESS_TOKEN_REQUIRED: 'Access token tidak boleh kosong',
    ACCESS_TOKEN_TIPE: 'Access token harus berupa string',

    DESCRIPTION_TIPE: 'Deskripsi harus berupa string',
    DESCRIPTION_MIN_LENGTH: 'Deskripsi minimal 20 Karakter',
    DESCRIPTION_MAX_LENGTH: 'Deskripsi maksimal 255 Karakter',
    DESCRIPTION_REQUIRED: 'Deskripsi tidak boleh kosong',

    PRICE_REQUIRED: 'Harga tidak boleh kosong',
    PRICE_INTEGER: 'Harga harus berupa angka',

    PRICE_TRASH_REQUIRED: 'Harga sampah tidak boleh kosong',

    WEIGHT_TRASH_REQUIRED: 'Berat sampah tidak boleh kosong',

    TYPE_TRASH_REQUIRED: 'Tipe sampah tidak boleh kosong',
    TYPE_TRASH_MIN_LENGTH: 'Tipe sampah minimal 5 Karakter',
    TYPE_TRASH_MAX_LENGTH: 'Tipe sampah maksimal 255 karakter',

    REASON_UPDATE_REQUIRED: 'Alasan pembaharuan harus terisi',
    REASON_UPDATE_MIN_LENGTH: 'Alasan pembaharuan minimal 10 Karakter',
    REASON_UPDATE_MAX_LENGTH: 'Alasan pembaharuan maksimal 255 karakter',

    REASON_DELETE_REQUIRED: 'Alasan penghapusan harus terisi',
    REASON_DELETE_MIN_LENGTH: 'Alasan penghapusan minimal 10 Karakter',
    REASON_DELETE_MAX_LENGTH: 'Alasan penghapusan maksimal 255 karakter',
  };

  ///Success Message Authentication
  static readonly SUCCESS_MESSAGES_AUTHENTICATION = {
    REGISTRATION_SUCCESS:
      'Pendaftaran berhasil. Silakan cek email untuk melakukan verifikasi.',
    LOGIN_SUCCESS: 'Login berhasil.',
    VERIFICATION_SUCCESS: 'Verifikasi akun berhasil. Silakan login.',
    RESEND_VERIFICATION_SUCCESS:
      'Kode OTP berhasil dikirim ulang. Periksa email Anda.',
    PASSWORD_CHANGED_SUCCESS:
      'Password berhasil diubah, silahkan login dengan password baru',
    VERIFICATION_OTP_FORGOT_PASSWORD_SUCCESS: 'Kode OTP yang dimasukkan benar',
    LOGOUT_SUCCESS: 'Logout berhasil.',
  };

  ///Failure Message Authentication
  static readonly FAILURE_MESSAGES_AUTHENTICATION = {
    PHONE_ALREADY_USED: 'No handphone sudah digunakan',
    INVALID_CREDENTIALS: 'Email atau password salah',

    EMAIL_ALREADY_USED: 'Email sudah digunakan',
    EMAIL_NOT_REGISTERED:
      'Email yang dimasukkan belum terdaftar, silahkan daftar terlebih dahulu.',

    ACCOUNT_NOT_VERIFIED:
      'Akun Anda belum diverifikasi. Silakan periksa email Anda untuk melakukan verifikasi.',
    ACCOUNT_ALREADY_VERIFIED: 'Akun Anda sudah diverifikasi. Silakan login.',

    OTP_INVALID_OR_EXPIRED: 'Kode OTP tidak valid atau sudah kadaluarsa.',
    OTP_EXPIRED: 'Kode OTP sudah kadaluarsa.',

    MANY_REQUEST:
      'Anda telah melakukan banyak permintaan. Silakan coba lagi dalam',
    MANY_INPUT_OTP:
      'Anda telah mencapai batas maksimal percobaan OTP untuk verifikasi ini. Silakan coba lagi dalam',

    PASSWORD_SAME: 'Password baru tidak boleh sama dengan password lama',
    OLD_PASSWORD_IS_WRONG: 'Password lama yang anda masukkan salah',

    FORBIDDEN_ACCESS: 'Anda tidak memiliki izin untuk mengakses resource ini',

    INVALID_TOKEN: 'Token tidak di ditemukan atau format tidak valid',
    INVALID_OR_EXPIRED_TOKEN: 'Token tidak valid atau sudah kedaluwarsa',
    OTP_ATTEMPT_LIMIT_REACHED:
      'Anda telah mencapai batas maksimal percobaan OTP untuk verifikasi ini. silahkan coba lagi dalam 10 menit.',
  };

  static readonly FAILURE_MESSAGE_FORMAT_FILE = {
    EMPTY_FILE: 'Gambar tidak boleh kosong',
    MAX_SIZE_EXCEEDED: 'Ukuran gambar maksimal 5MB',
    INVALID_MIME_TYPE:
      'Hanya file dengan tipe gambar JPG, PNG, dan WebP yang diperbolehkan',
    INVALID_EXTENSION:
      'Ekstensi file tidak valid. Hanya file .jpg, .jpeg, dan .png yang diperbolehkan',
  };

  static readonly FAILURE_MESSAGE_TRANSACTION = {
    ADMIN_NOT_FOUND: 'id Admin tidak ditemukan',
    USER_NOT_FOUND: 'id User tidak ditemukan',
    TRASH_NOT_FOUND: 'id Sampah tidak ditemukan',
  };

  static readonly STATUS_TRASHITEM = {
    UPDATED_STATUS: 'Update',
    DELETED_STATUS: 'Delete',
  };

  static readonly TYPE_TRANSACTION = {
    TRANSACTION_BALANCE_IN: 'Saldo Masuk',
    TRANSACTION_BALANCE_OUT: 'Saldo Keluar',
  };

  static readonly SUCCESS_MESSAGES_TRANSACTION = {
    TRANSACTION_SUCCESS: 'Transaksi berhasil dibuat',
    UPDATE_TRANSACTION_SUCCESS: 'Item sampah dan saldo berhasil diperbarui',
  };
}
