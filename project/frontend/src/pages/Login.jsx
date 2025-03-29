import React, { useState, useEffect } from 'react';

import { Text, Button, Flex, Box, Card, TextField, Link, Checkbox, Callout } from "@radix-ui/themes";
import { Form } from "radix-ui";
import "@radix-ui/themes/styles.css";

import * as Icons from '../assets/Icons';
import NavigateButton from '../components/NavigateButton';
import { useAuth } from "../hooks/AuthProvider";

function Login() {

  const auth = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const updateFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckboxChange = (checked) => setRememberMe(checked);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData((prevData) => ({ ...prevData, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const [loginError, setLoginError] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', formData.email);
      localStorage.setItem('rememberedPassword', formData.password);
    } else {
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberedPassword');
    }
    setLoginError(!(await auth.login(formData)));
  };

  return (
    <Flex width="100vw" height="100vh" direction="column" align="center" justify="center">
      <Box asChild width="480px">
        <Card size="3">
          <Flex direction="column" align="center" justify="center" gap="20px">

            <Text size="7" weight="bold" my="20px">
              Sign In
            </Text>

            {loginError && (
              <Box width="380px">
                <Callout.Root color="red">
                  <Callout.Icon>
                    <Icons.AlertCircleOutline />
                  </Callout.Icon>
                  <Callout.Text>
                    Invalid credentials.
                  </Callout.Text>
                </Callout.Root>
              </Box>
            )}

            <Form.Root asChild className="FormRoot">
              <Flex direction="column" gap="20px">

                {/* Email */}
                <Form.Field className="FormField" name="email">
                  <Form.Label asChild className="FormLabel">
                    <Box asChild mb="10px" ml="6px">
                      <Text size="2" weight="medium">
                        Email
                      </Text>
                    </Box>
                  </Form.Label>
                  <Form.Control
                    asChild
                    className="Input"
                    type="email"
                    placeholder="Enter your email address..."
                    value={formData.email}
                    onChange={updateFormData}
                    required>
                    <Box asChild width="380px" height="50px">
                      <TextField.Root>
                        <TextField.Slot pl="10px" />
                        <TextField.Slot pr="10px" />
                      </TextField.Root>
                    </Box>
                  </Form.Control>
                </Form.Field>

                <Form.Field className="FormField" name="password">
                  <Form.Label asChild className="FormLabel">
                    <Box asChild mb="10px" ml="6px">
                      <Text size="2" weight="medium">
                        Password
                      </Text>
                    </Box>
                  </Form.Label>

                  <Form.Control
                    asChild
                    className="Input"
                    type="password"
                    value={formData.password}
                    onChange={updateFormData}
                    required
                    placeholder="Enter your password...">
                    <Box asChild width="380px" height="50px">
                      <TextField.Root>
                        <TextField.Slot pl="10px" />
                        <TextField.Slot pr="10px" />
                      </TextField.Root>
                    </Box>
                  </Form.Control>
                </Form.Field>

                {/* Password */}
                <Flex align="center" justify="between" m="4px">
                  <Text as="label" size="2">
                    <Flex as="span" gap='2' m="4px">
                      <Checkbox onCheckedChange={handleCheckboxChange} /> Remember me
                    </Flex>
                  </Text>
                  <Text size="2" align="right">
                    <Link href="/forgot-password"> Forgot password? </Link>
                  </Text>
                </Flex>

                <Form.Submit asChild onClick={handleLogin}>
                  <Button asChild variant="solid">
                    <Box width="380px" height="60px">
                      <Text size="5" weight="bold">
                        Continue
                      </Text>
                    </Box>
                  </Button>
                </Form.Submit>

              </Flex>
            </Form.Root>

            <Text size="2" m="4px">
              Don't have an account? <Link href="/signup">Create an account</Link>
            </Text>

          </Flex>
        </Card >
      </Box >

      <NavigateButton url="/portal" label="Back to portal" />

    </Flex >
  );
}

export default Login;