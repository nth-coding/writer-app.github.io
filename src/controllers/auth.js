import * as services from "../services";
console.log(services);

export const register = async (req, res) => {
  try {
    console.log('there is a request');
    // console.log(req);
    const { email, pass } = req.body;

    if (!pass || !email) {
        return res.status(400).json({
            message: "pass or email is empty",
        });
    }

    // console.log(req.body);

    const response = await services.register(req.body);
    return res.status(200).json({
        message: "register success",
        response,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};
