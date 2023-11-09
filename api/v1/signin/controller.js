import signinService from "../../../services/signin.js";

const signin = async (req, res, next) => {
  const {
    body: { username, password },
  } = req;
  try {
    const result = await signinService.signInAndCheckHrGroup(
      username?.toLowerCase(),
      password
    );
    res.status(result.statusCode).send(result);
  } catch (err) {
    return next(err);
  }
};

export default signin;
