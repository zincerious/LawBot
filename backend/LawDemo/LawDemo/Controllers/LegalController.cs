using LawDemo.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;

namespace LawDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LegalController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public LegalController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClient = httpClientFactory.CreateClient();
            _configuration = configuration;
        }

        [HttpPost("ask")]
        public async Task<IActionResult> AskLegalAI([FromBody] LegalRequest request)
        {
            var apiKey = _configuration["Gemini:ApiKey"]!;
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={apiKey}";

            var prompt = $"Bạn là một luật sư AI chuyên về tư vấn pháp luật Việt Nam. Chỉ trả lời các câu hỏi liên quan đến pháp luật Việt Nam, từ chối lịch sự nếu câu hỏi không phù hợp. Câu hỏi của người dùng: {request.Scenario}";

            var payload = new
            {
                contents = new[] 
                {
                    new
                    {
                        parts = new []
                        {
                            new
                            {
                                text = prompt
                            }
                        },
                    }
                }
            };

            var httpContent = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(url, httpContent);

            var resultString =  await response.Content.ReadAsStringAsync();
            return Content(resultString, "application/json");
        }
    }
}
