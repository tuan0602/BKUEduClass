package com.example.demo.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {

        SecurityScheme securityScheme = new SecurityScheme()
                .name("BearerAuth")
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT");

        SecurityRequirement securityRequirement = new SecurityRequirement()
                .addList("BearerAuth"); // sẽ dùng cho các endpoint bảo mật

        return new OpenAPI()
                .info(new Info()
                        .title("API với JWT")
                        .description("Demo Swagger + JWT"))
                // Không áp dụng securityRequirement cho toàn bộ OpenAPI
                .schemaRequirement("BearerAuth", securityScheme);
    }
}