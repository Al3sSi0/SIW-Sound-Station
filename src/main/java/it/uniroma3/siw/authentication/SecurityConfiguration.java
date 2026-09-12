package it.uniroma3.siw.authentication;

import java.util.List;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import it.uniroma3.siw.model.Credentials;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
	@Autowired
    private JwtRequestFilter jwtRequestFilter;
    private final DataSource dataSource;

    public SecurityConfiguration(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        JdbcUserDetailsManager manager = new JdbcUserDetailsManager(dataSource);
        manager.setUsersByUsernameQuery("SELECT username, password, 1 as enabled FROM credentials WHERE username=?");
        manager.setAuthoritiesByUsernameQuery("SELECT username, role FROM credentials WHERE username=?");
        return manager;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    protected SecurityFilterChain configure(final HttpSecurity httpSecurity) throws Exception {
    	
    	httpSecurity.cors(cors -> {});
    	httpSecurity.csrf(csrf -> csrf.ignoringRequestMatchers("/api/**"));
    	httpSecurity.sessionManagement(session -> 
	    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
	);
    	
    	httpSecurity.authorizeHttpRequests(authorize -> {
    	   
    	    authorize.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll();
    	    
    	
    	    authorize.requestMatchers(HttpMethod.GET, "/", "/index", "/css/**", "/images/**", "/favicon.ico", "/error").permitAll();
    	    authorize.requestMatchers(HttpMethod.GET, "/register", "/login").permitAll();
    	    authorize.requestMatchers(HttpMethod.POST, "/register", "/login").permitAll();
    	    
    	    
    	    authorize.requestMatchers(HttpMethod.GET, "/brani/**", "/album/**", "/artisti/**").permitAll();
    	    authorize.requestMatchers(HttpMethod.GET, "/api/brani/**", "/api/albums/**", "/api/artisti/**").permitAll();
    	    
    	    authorize.requestMatchers(HttpMethod.POST, "/api/brani/**", "/api/albums/**", "/api/artisti/**").hasAnyAuthority(Credentials.ADMIN_ROLE);
    	    authorize.requestMatchers(HttpMethod.PUT, "/api/brani/**", "/api/albums/**", "/api/artisti/**").hasAnyAuthority(Credentials.ADMIN_ROLE);
    	    authorize.requestMatchers(HttpMethod.DELETE, "/api/brani/**", "/api/albums/**", "/api/artisti/**").hasAnyAuthority(Credentials.ADMIN_ROLE);
    	    authorize.requestMatchers("/admin/**").hasAnyAuthority(Credentials.ADMIN_ROLE);
    	    
    	    authorize.requestMatchers("/api/users/**").authenticated();
    	    authorize.requestMatchers("/api/playlists/**").authenticated();
    	    
    	    
    	    authorize.requestMatchers("/api/**", "/error").permitAll(); 
    	    
    	    authorize.anyRequest().authenticated();
    	});
    	
    	
    	httpSecurity.exceptionHandling(exception -> exception
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(jakarta.servlet.http.HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\": \"Token JWT assente, scaduto o non valido\"}");
                })
            );
    	
    	
    	httpSecurity.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
        
        httpSecurity.formLogin(form -> {
            form.loginPage("/login").permitAll();
            form.defaultSuccessUrl("/", true); 
            form.failureUrl("/login?error=true"); 
        });

        
        httpSecurity.logout(logout -> {
            logout.logoutUrl("/logout");
            logout.logoutSuccessUrl("/"); 
            logout.invalidateHttpSession(true);
            logout.deleteCookies("JSESSIONID"); 
            logout.clearAuthentication(true); 
            logout.permitAll();
        });

        return httpSecurity.build();
    }
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        config.setAllowCredentials(true);
        config.setAllowedOrigins(List.of("http://localhost:5173")); // Autorizza il frontend Vite
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}