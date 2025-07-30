using System.ComponentModel.DataAnnotations;

namespace Identity.Application.DTOs;

public class SignUpRequest
{
    [Required(ErrorMessage = "Ism kiritish majburiy")]
    [StringLength(50, ErrorMessage = "Ism 50 ta belgidan oshmasligi kerak")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Familiya kiritish majburiy")]
    [StringLength(50, ErrorMessage = "Familiya 50 ta belgidan oshmasligi kerak")]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Telefon raqam kiritish majburiy")]
    [Phone(ErrorMessage = "Telefon raqam formati noto'g'ri")]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required(ErrorMessage = "Foydalanuvchi nomi kiritish majburiy")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Foydalanuvchi nomi 3-50 ta belgi orasida bo'lishi kerak")]
    public string UserName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email kiritish majburiy")]
    [EmailAddress(ErrorMessage = "Email formati noto'g'ri")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Parol kiritish majburiy")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Parol kamida 6 ta belgidan iborat bo'lishi kerak")]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "Parolni tasdiqlash majburiy")]
    [Compare("Password", ErrorMessage = "Parollar mos kelmaydi")]
    public string ConfirmPassword { get; set; } = string.Empty;
}