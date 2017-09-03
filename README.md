# RSU tax implications calculator

This web page calculates the tax implications of selling RSUs belonging to people paying income tax in Israel.

## Setting Up
1. Install [Homebrew](https://brew.sh/).
2. Install NodeJS through hombrew by running `brew install node`.
3. Navigate to the project directory.
4. Install dependencies by running `npm install`
5. Use the following commands to work with the project:
    * `npm run start` - starts up a dev server that will compile with every change to the code.
    * `npm run build` - will build the project in production mode (run this before `npm run deploy`). This will create a build directory in your project.
    * `npm run deploy` - will deploy the build directory to gh-pages.

## TODO

1. mark obligatory & optional fields
1. Find api for today's prices 
1. Add loading spinner
1. Better date entering fields


## Feedback from alpha

1. Add explanation about how the calculation was made
1. Add explanation about trustee fees
1. Add explanation (tooltip) about the input fields and why they are needed (e.g grant date)
1. Add disclaimer (that I am not an accountant)     

## links explaining RSUs in Israel

- http://www.hasolidit.com/kehila/threads/%D7%9E%D7%93%D7%99%D7%A0%D7%99%D7%95%D7%AA-%D7%9E%D7%99%D7%A1%D7%95%D7%99-%D7%A9%D7%9C-rsus.2111/