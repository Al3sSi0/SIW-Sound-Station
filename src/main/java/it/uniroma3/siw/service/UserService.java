package it.uniroma3.siw.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.uniroma3.siw.model.User;
import it.uniroma3.siw.repository.CredentialsRepository;
import it.uniroma3.siw.repository.UserRepository;
import jakarta.transaction.Transactional;

@Service
public class UserService {

    private final CredentialsRepository credentialsRepository;

    @Autowired
    private UserRepository userRepository;

    UserService(CredentialsRepository credentialsRepository) {
        this.credentialsRepository = credentialsRepository;
    }

    public User getUser(Long id) { 
        return this.userRepository.findById(id).orElse(null);
    }

    @Transactional
    public User saveUser(User user) { 
        return this.userRepository.save(user);
    }


}
