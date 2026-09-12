package it.uniroma3.siw.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import it.uniroma3.siw.model.Playlist;
import it.uniroma3.siw.model.User;

public interface PlaylistRepository extends CrudRepository<Playlist, Long>{
	List<Playlist> findByUtente(User utente);
}
