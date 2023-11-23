import axios from 'axios';
export const generateMessage = async(context) =>{
    const options = {
      method: 'POST',
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer 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'
      },
      data: {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: context
          }
        ]
      }
    };
    
    const responseGpt = await axios.request(options).then(function (response) {
      return response.data
    }).catch(function (error) {
      return error
    });
    return responseGpt
}
