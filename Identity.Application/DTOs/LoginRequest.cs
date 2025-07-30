using System.ComponentModel.DataAnnotations;

namespace Identity.Application.DTOs;

public class LoginRequest
{
    [Required(ErrorMessage = "Email yoki foydalanuvchi nomi kiritish majburiy")]
    public string EmailOrUserName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Parol kiritish majburiy")]
    public string Password { get; set; } = string.Empty;
}