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

## Deployment

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

### Custom Nginx Configuration

The Dockerfile in this repository includes an nginx.conf file that configures the Nginx server. If you need to customize Nginx behavior, you can modify this configuration file to suit your requirements.

### Production Build

The Dockerfile uses multi-stage builds to keep the final image lightweight. The Angular app is built in the first stage and then served by Nginx in the second stage. This ensures that only the necessary files are included in the final image, optimizing deployment.
Updating the Deployment

If you make changes to your Angular app and want to update the deployment, follow these steps:

1. Build a new Docker image as shown above:

```bash
    docker build -t earsavant .
```




2. Stop and remove the existing container:

```bash
    docker stop CONTAINER_ID
    docker rm CONTAINER_ID
```
Replace CONTAINER_ID with the actual ID of the running container.

3. Run the new Docker container using the updated image:

```bash
    docker run -d -p 80:80 earsavant
```


Earsavant should now be updated and running in the Docker container, accessible at http://localhost:80.

## License

This project is proprietary and all rights are reserved. Unauthorized copying or distribution of this project, or any portion of it, is strictly prohibited.

## Contact

For inquiries and support, please contact aytar.akdemir@outlook.com
