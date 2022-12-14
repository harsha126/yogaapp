import "./App.css";
import React, { useEffect, useRef } from "react";
import { Button, Form, Input, Select, Table } from "antd";
import { useState } from "react";

const Batch = (props) => {
  const { currUser } = props;
  const [changed, setChanged] = useState(false);
  useEffect(() => {
    console.log("inUseeffect");
  }, []);

  const [batchSelected, setBatchSelected] = useState(1);
  const onFinish = (values) => {
    console.log(values);
    currUser["sub"] = null;
    currUser["bb"] = null;
    delete currUser.sub;
    delete currUser.bb;
    currUser["batch"] = batchSelected;
    fetch("http://localhost:4000/update", {
      method: "POST",
      body: JSON.stringify(currUser),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      console.log(res);

      const response = await res.json();
      console.log(response);
      setChanged(true);
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const [error, setError] = useState({
    there: false,
    message: null,
  });

  const handleChange = (value) => {
    console.log(`selected ${value}`);
    setBatchSelected(value);
  };
  const date = new Date(currUser.lastpaiddate);

  var firstDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    1
  ).toDateString(); // first day of the month
  var lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).toDateString(); // last day of the month

  const columns = [
    {
      title: "Name",
      dataIndex: "username",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "name",
    },
    {
      title: "Subscription",
      dataIndex: "sub",
      key: "name",
    },
    {
      title: "Batch",
      dataIndex: "bb",
      key: "name",
    },
  ];

  const batchs = ["6-7AM", "7-8AM", "8-9AM", "6-7AM"];

  const ff = currUser.haspaid ? (
    `${firstDay} -> ${lastDay}`
  ) : (
    <>
      <p>please select a batch</p>
    </>
  );

  const tt = currUser.haspaid ? (
    `${batchs[currUser.batch - 1]}`
  ) : (
    <>
      <p>please select a batch</p>
      <Select
        onChange={handleChange}
        defaultValue="1"
        style={{
          width: 120,
        }}
        allowClear
        options={[
          {
            value: "1",
            label: "6-7AM",
          },
          {
            value: "2",
            label: "7-8AM",
          },
          {
            value: "3",
            label: "8-9AM",
          },
          {
            value: "4",
            label: "5-6AM",
          },
        ]}
      />
    </>
  );
  currUser["sub"] = ff;
  currUser["bb"] = tt;
  const data = [];
  data.push(currUser);
  return (
    <>
      {(changed || !changed) && (
        <div className="upForm">
          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <div>
              <Table columns={columns} dataSource={data} pagination={false} />
            </div>
            {!currUser.haspaid && (
              <>
                <br></br>
                <br></br>
                <Form.Item
                  wrapperCol={{
                    offset: 4,
                    span: 16,
                  }}
                >
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </>
            )}
            <br />
            <br />
            {error.there && <p className="error"> {error.message}</p>}
          </Form>
        </div>
      )}
    </>
  );
};

function App() {
  const [error, setError] = useState({
    there: false,
    message: null,
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ussually  false fro testing ture
  const [onLogin, setOnLogin] = useState(true);
  const [currUser, setCurrUser] = useState(null);

  const onFinish = (values) => {
    console.log("Success:", values);
    if (onLogin) {
      fetch("http://localhost:4000/login", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (res) => {
        if (res.status === 400) {
          setError({ there: true, message: "please enter valid credentials" });
        } else {
          const response = await res.json();
          console.log(response);
          setIsLoggedIn(true);
          setCurrUser(response);
        }
      });
    } else {
      fetch("http://localhost:4000/signup", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (res) => {
        if (res.status === 400) {
          setError({
            there: true,
            message: "user already exists please login",
          });
        } else {
          console.log(res);
          const response = await res.json();
          setIsLoggedIn(true);
          console.log(response);
          setCurrUser(response);
        }
      });
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const loginTitle = (
    <div className="heading">
      <h2
        className={!onLogin ? null : "active"}
        onClick={() => {
          setOnLogin(true);
        }}
      >
        Log In
      </h2>
    </div>
  );
  const signUpTitle = (
    <div className="heading">
      <h2
        className={!onLogin ? "active" : null}
        onClick={() => {
          setOnLogin(false);
        }}
      >
        Sign Up
      </h2>
    </div>
  );

  return (
    <div className="App">
      {!isLoggedIn ? (
        <div className="form">
          <div className="title">
            {loginTitle}
            {signUpTitle}
          </div>
          <br />
          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input onChange={() => setError(false)} />
            </Form.Item>
            <br />
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <br />
            {!onLogin && (
              <Form.Item
                label="Age"
                name="Age"
                rules={[
                  {
                    required: true,
                    message: "Please input your Age!",
                  },
                ]}
              >
                <Input type="Number" min={5} />
              </Form.Item>
            )}
            <br />
            {error.there && <p className="error"> {error.message}</p>}
            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                {onLogin ? "Login" : "SignUp"}
              </Button>
            </Form.Item>
          </Form>
        </div>
      ) : (
        <Batch currUser={currUser}></Batch>
      )}
    </div>
  );
}

export default App;
