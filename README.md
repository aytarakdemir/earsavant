# EarSavant Ear Training Application

Ear training application which focuses on functional training.

## Prerequisites

Make sure you have the following software installed before running the application:

- Node.js (v18.16.0 or later)
- npm (v9.5.1 or later)

## Installation

1. Clone the repository:

```shell
git clone https://github.com/aytarakdemir/earsavant.git
```

Navigate to the project directory:

```shell
cd earsavant
```
Install the dependencies:

```shell
npm install
```

## Usage

1. Build the project:

```shell
npm run build
```

2. Start the development server:

```shell
npm start
```
The application will be accessible at http://localhost:4200.

## Contributing

1. Fork the repository.

2. Create a new branch:

```shell
git checkout -b feature/my-feature
```
    

3. Make your changes and commit them.

4. Push the changes to your forked repository.

5. Create a pull request on the original repository.


## Development with Docker

Dockerfile.dev is provided for setting up development container using Docker.

To use the container for development, follow these steps:

1. Install Docker: Make sure you have Docker installed on your system. Refer to the official Docker documentation for instructions on how to install Docker for your operating system.

2. Build the Docker image: Open a terminal or command prompt and navigate to the directory where the Dockerfile is located. Run the following command to build the Docker image:

```bash
docker build -t earsavant -f Dockerfile.dev .
```

3. Run the Docker container: Once the image is built, you can run the container using the following command:

```bash
docker run -dp 4200:4200 -v ${PWD}:/app/ earsavant
```

This command starts the Docker container in the background (-d option) and maps port 4200 from the host to port 4200 in the container (-p 4200:4200 option). It also mounts the current working directory (${PWD}) on the host to the /app/ directory inside the container (-v ${PWD}:/app/ option).

4. Access the application: After the container is running, you can access the application by opening a web browser and navigating to http://localhost:4200. Any changes you make to the project files on the host will be reflected in the running container due to the volume mount.

5. Development workflow: Use your preferred code editor or IDE on the host machine to edit the project files. The changes will be automatically synchronized with the running container, allowing you to see the updates in real-time. You can leverage the hot module replacement feature provided by Angular to enable live reloading of the application as you make changes.

## Deployment with Docker

To deploy the Angular app using Docker and Nginx, follow the steps below:

### Prerequisites

Docker must be installed on the deployment server.

### Building the Docker Image

1. Clone the repository to your deployment server.

2. Navigate to the root directory of the project.

3. Open the terminal and build the Docker image using the following command:

```bash
docker build -t earsavant .
```

### Running the Docker Container

Once the Docker image is built, you can run the container using the following command:

```bash
docker run -d -p 80:80 earsavant
```
The -d flag runs the container in detached mode, and -p 80:80 maps port 80 of the host to port 80 of the container. Modify the port mapping as needed.

The application should now be accessible at http://localhost:80.

## License

This project is proprietary and all rights are reserved. Unauthorized copying or distribution of this project, or any portion of it, is strictly prohibited.

## Contact

For inquiries and support, please contact aytar.akdemir@outlook.com
